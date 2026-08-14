<script>
	import { fly } from 'svelte/transition';
	import { marked } from 'marked';
	import { tick } from 'svelte';
	import ChatChart from '$lib/components/ChatChart.svelte';
	import { get } from 'svelte/store';
	import courses from '$lib/assets/courses.json';
	import { getPredictorSelectedOptions } from '$lib/stores/stores.js';

	let open = false;
	let input = '';
	let loading = false;
	let messagesEl;

	let fileInput;
	let pendingImage = null;
	let pendingImageError = '';

	const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

	// Identifies this conversation so the server can reuse tool results across turns.
	// Kept in sessionStorage so the cache survives a page navigation in the same tab.
	function conversationId() {
		if (typeof sessionStorage === 'undefined') return undefined;
		let id = sessionStorage.getItem('ibp-chat-id');
		if (!id) {
			id = crypto.randomUUID().replace(/-/g, '');
			sessionStorage.setItem('ibp-chat-id', id);
		}
		return id;
	}

	// A turn is {role:'user', content} or {role:'assistant', parts:[...]}
	// where a part is {kind:'text', content} or {kind:'tool', label, status:'running'|'ok'|'error', summary}
	let turns = [];

	const SUGGESTIONS = [
		{ label: 'Find boundaries', prompt: 'M25 boundaries for HL Chemistry', icon: '⌕' },
		{ label: 'Analyze trends', prompt: 'Analyze HL Math AA grade boundaries over time', icon: '↗' },
		{ label: 'Forecast', prompt: 'Are HL Physics boundaries likely to go up or down?', icon: '◒' },
		{ label: 'Diploma help', prompt: 'Why is my diploma not awarded?', icon: '?' }
	];

	function newConversation() {
		turns = [];
		input = '';
		pendingImage = null;
		pendingImageError = '';
		if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('ibp-chat-id');
	}

	function render(text) {
		return marked.parse(text, { breaks: true });
	}

	async function scrollToBottom() {
		await tick();
		if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
	}

	// Flatten turns into the plain-text history the API expects
	function history() {
		return turns
			.map((t) =>
				t.role === 'user'
					? { role: 'user', content: t.content }
					: {
							role: 'assistant',
							content: t.parts
								.filter((p) => p.kind === 'text' && p.content)
								.map((p) => p.content)
								.join('\n')
					  }
			)
			.filter((m) => m.content);
	}

	function onFileChange(e) {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;
		pendingImageError = '';
		if (!file.type.startsWith('image/')) {
			pendingImageError = 'Please upload an image file.';
			return;
		}
		if (file.size > MAX_IMAGE_BYTES) {
			pendingImageError = 'Image is too large (max 5MB).';
			return;
		}
		const reader = new FileReader();
		reader.onload = () => (pendingImage = reader.result);
		reader.readAsDataURL(file);
	}

	const NUMBER_WORDS = { one: '1', two: '2', three: '3', four: '4', five: '5', six: '6' };

	function normalizeComponent(s) {
		return s
			.toLowerCase()
			.replace(/[()]+/g, ' ')
			.replace(/[^a-z0-9]+/g, ' ')
			.trim()
			.split(' ')
			.map((w) => NUMBER_WORDS[w] || w)
			.join(' ');
	}

	function componentTokens(s) {
		const tokens = normalizeComponent(s).split(' ').filter(Boolean);
		// merge a trailing bare 'a'/'b' onto the digit before it: ['1','b'] -> ['1b']
		const merged = [];
		for (const t of tokens) {
			if (merged.length && /^\d+$/.test(merged[merged.length - 1]) && /^[ab]$/.test(t)) {
				merged[merged.length - 1] += t;
			} else {
				merged.push(t);
			}
		}
		return merged;
	}

	function matchComponent(assessments, query) {
		const numCompatible = (a, b) => a === b || a.startsWith(b) || b.startsWith(a);
		const qTokens = componentTokens(query);
		const qNums = qTokens.filter((t) => /^\d+[ab]?$/.test(t));
		let best = null;
		let tie = false;
		for (let i = 0; i < assessments.length; i++) {
			const kTokens = componentTokens(assessments[i].name);
			const kNums = kTokens.filter((t) => /^\d+[ab]?$/.test(t));
			if (
				qNums.length &&
				kNums.length &&
				!qNums.some((qn) => kNums.some((kn) => numCompatible(qn, kn)))
			)
				continue;

			let matched = 0;
			for (const q of qTokens) {
				if (
					kTokens.some(
						(k) =>
							k === q || (q.length >= 3 && k.startsWith(q)) || (k.length >= 3 && q.startsWith(k))
					)
				)
					matched++;
			}
			const score = qTokens.length ? matched / qTokens.length : 0;
			if (score >= 0.5) {
				if (!best || score > best.score) {
					best = { index: i, score };
					tie = false;
				} else if (score === best.score) {
					tie = true;
				}
			}
		}
		if (best && !tie) return best.index;

		// No digit reference and no confident match — if exactly one assessment has no
		// paper number at all, it's the subject's IA/Portfolio/Fieldwork/Exploration-style
		// slot, whatever it's locally called.
		if (!qNums.length) {
			const nonPaper = assessments
				.map((a, i) => ({ i, hasNum: componentTokens(a.name).some((t) => /^\d+[ab]?$/.test(t)) }))
				.filter((a) => !a.hasNum);
			if (nonPaper.length === 1) return nonPaper[0].i;
		}
		return -1;
	}

	function nativeGroupIndex(subject) {
		for (let g = 0; g <= 5; g++) {
			if ((courses.meta[`group${g + 1}`] || []).includes(subject)) return g;
		}
		return null;
	}

	function findGroupForSubject(subject) {
		for (let g = 0; g <= 6; g++) {
			if (get(getPredictorSelectedOptions(g)).subject === subject) return { group: g };
		}
		const native = nativeGroupIndex(subject);
		if (native === null) return null;

		if (!get(getPredictorSelectedOptions(native)).subject) return { group: native };

		// Native slot taken — try the flexible Group 6 slot (index 5) as an override
		if (native !== 5 && !get(getPredictorSelectedOptions(5)).subject) {
			return { group: 5, groupSixGroup: native };
		}
		return null;
	}

	const LANGUAGES = [
		'english',
		'spanish',
		'french',
		'mandarin',
		'chinese',
		'german',
		'japanese',
		'korean',
		'italian',
		'portuguese',
		'russian',
		'arabic',
		'hindi',
		'dutch',
		'swedish',
		'polish',
		'turkish',
		'latin',
		'greek'
	];

	function detectLanguage(text) {
		const t = text.toLowerCase();
		return LANGUAGES.find((l) => t.includes(l)) || null;
	}

	function normalizeWords(s) {
		return s
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, ' ')
			.trim()
			.split(' ')
			.filter(Boolean);
	}

	function findSubjectKey(rawSubject) {
		if (courses[rawSubject]) return rawSubject;
		const target = rawSubject.trim().toLowerCase();
		const exact = Object.keys(courses).find((k) => k !== 'meta' && k.toLowerCase() === target);
		if (exact) return exact;

		const lang = detectLanguage(rawSubject);
		const stripped = lang ? rawSubject.toLowerCase().replace(lang, ' ') : rawSubject;
		const qTokens = normalizeWords(stripped);

		let best = null;
		for (const key of Object.keys(courses)) {
			if (key === 'meta') continue;
			const kTokens = normalizeWords(key);
			const matched = qTokens.filter((q) => kTokens.includes(q)).length;
			const score = qTokens.length ? matched / qTokens.length : 0;
			if (score > 0 && (!best || score > best.score)) best = { key, score };
		}
		return best && best.score >= 0.5 ? best.key : null;
	}

	function applyCoreMarks(key, scores) {
		const settings = getPredictorSelectedOptions(6);
		const current = get(settings);
		current.chosenScores = current.chosenScores || { tok: [0, 0], ee: [0] };

		const isTok = key === 'Theory Of Knowledge';
		const bucket = isTok ? 'tok' : 'ee';
		const arr = current.chosenScores[bucket] || (isTok ? [0, 0] : [0]);

		let matched = 0;
		for (const { component, mark } of scores) {
			// TOK has exactly two known slots; EE has exactly one — no fuzzy guessing needed
			const idx = isTok ? (component.toLowerCase().includes('exhibition') ? 1 : 0) : 0;
			arr[idx] = mark;
			matched++;
		}
		current.chosenScores[bucket] = arr;
		settings.set(current);

		return {
			ok: matched > 0,
			label: `Set ${key}`,
			summary: `${matched}/${scores.length} marks applied`
		};
	}

	function applySubjectMarks({ subject: rawSubject, level, language, scores }) {
		const key = findSubjectKey(rawSubject);
		const meta = key ? courses[key] : null;
		if (!meta) return { ok: false, label: `Couldn't find subject "${rawSubject}" on the site` };
		if ((meta.groupNumber || []).includes(99)) {
			return applyCoreMarks(key, scores);
		}
		const subject = key;
		const detectedLanguage = language || detectLanguage(rawSubject);

		const placement = findGroupForSubject(subject);
		if (placement === null) return { ok: false, label: `No open slot for ${subject}` };

		const settings = getPredictorSelectedOptions(placement.group);
		const current = get(settings);
		if (placement.groupSixGroup !== undefined) current.groupSixGroup = placement.groupSixGroup;

		current.subject = subject;
		current.level = level;
		if (detectedLanguage)
			current.language = detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1);

		const assessments = meta[level] || [];
		const chosen = current.chosenScores || [];
		let matched = 0;
		const unmatched = [];
		for (const { component, mark } of scores) {
			const idx = matchComponent(assessments, component);
			if (idx === -1) {
				unmatched.push(component);
				continue;
			}
			chosen[idx] = mark;
			matched++;
		}
		current.chosenScores = chosen;
		settings.set(current);

		const summary =
			`${matched}/${scores.length} marks applied` +
			(unmatched.length ? ` — couldn't match: ${unmatched.join(', ')}` : '');
		return { ok: matched > 0, label: `Set ${level} ${subject}`, summary };
	}

	async function send(text) {
		const question = (text ?? input).trim();
		if ((!question && !pendingImage) || loading) return;
		input = '';
		const image = pendingImage;

		pendingImage = null;
		turns = [...turns, { role: 'user', content: question || '(attached image)', image }];
		loading = true;
		scrollToBottom();

		const payload = history();
		const turn = { role: 'assistant', parts: [] };
		turns = [...turns, turn];

		const pushText = (delta) => {
			let last = turn.parts[turn.parts.length - 1];
			if (!last || last.kind !== 'text') {
				last = { kind: 'text', content: '' };
				turn.parts.push(last);
			}
			last.content += delta;
		};

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: payload, conversationId: conversationId(), image })
			});

			if (!res.ok || !res.body) {
				let msg = 'Sorry, something went wrong. Please try again.';
				if (res.status === 429) msg = 'Slow down a little — try again in a few minutes.';
				else {
					try {
						msg = (await res.json()).message || msg;
					} catch {
						// Fall back to the generic error message when the response is not JSON.
					}
				}
				pushText(msg);
			} else {
				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';
				for (;;) {
					const { done, value } = await reader.read();
					if (done) break;
					buffer += decoder.decode(value, { stream: true });
					const lines = buffer.split('\n');
					buffer = lines.pop();
					for (const line of lines) {
						if (!line.trim()) continue;
						let ev;
						try {
							ev = JSON.parse(line);
						} catch {
							continue;
						}
						if (ev.type === 'text') pushText(ev.delta);
						else if (ev.type === 'tool_start')
							turn.parts.push({ kind: 'tool', id: ev.id, label: ev.label, status: 'running' });
						else if (ev.type === 'tool_end') {
							const part = turn.parts.find((p) => p.kind === 'tool' && p.id === ev.id);
							if (part) {
								part.status = ev.ok ? 'ok' : 'error';
								part.summary = ev.summary;
								part.cached = ev.cached;
							}
						} else if (ev.type === 'chart')
							turn.parts.push({
								kind: 'chart',
								title: ev.title,
								labels: ev.labels,
								datasets: ev.datasets
							});
						else if (ev.type === 'client_action' && ev.action === 'set_subject_marks') {
							const r = applySubjectMarks(ev);
							turn.parts.push({
								kind: 'tool',
								label: r.label,
								status: r.ok ? 'ok' : 'error',
								summary: r.summary
							});
						} else if (ev.type === 'error') pushText(ev.message);
					}
					turns = turns;
					scrollToBottom();
				}
			}
		} catch {
			pushText('Network error. Please try again.');
		}
		turns = turns;
		loading = false;
		scrollToBottom();
	}

	function onKeydown(e) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div class="chat-root">
	{#if open}
		<div class="panel" transition:fly={{ y: 20, duration: 200 }}>
			<div class="header">
				<div class="identity">
					<div class="brand-mark" aria-hidden="true">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
							<path
								d="M12 3.5c.5 4.7 3.8 8 8.5 8.5-4.7.5-8 3.8-8.5 8.5-.5-4.7-3.8-8-8.5-8.5 4.7-.5 8-3.8 8.5-8.5Z"
							/>
						</svg>
					</div>
					<div>
						<div class="title">IB Predict</div>
						<div class="subtitle">
							<span class="status-dot" /> Academic assistant <span>Beta</span>
						</div>
					</div>
				</div>
				<div class="header-actions">
					<button
						class="icon-button"
						type="button"
						on:click={newConversation}
						aria-label="Start a new chat"
						title="New chat"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
						</svg>
					</button>
					<button
						class="icon-button"
						type="button"
						on:click={() => (open = false)}
						aria-label="Close chat"
						title="Close"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							stroke-linecap="round"
						>
							<path d="M6 6l12 12M18 6 6 18" />
						</svg>
					</button>
				</div>
			</div>
			<div class="messages" bind:this={messagesEl}>
				{#if turns.length === 0}
					<div class="welcome">
						<div class="welcome-mark" aria-hidden="true">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55">
								<path
									d="M12 3.5c.5 4.7 3.8 8 8.5 8.5-4.7.5-8 3.8-8.5 8.5-.5-4.7-3.8-8-8.5-8.5 4.7-.5 8-3.8 8.5-8.5Z"
								/>
							</svg>
						</div>
						<p class="welcome-kicker">IB Predict Assistant</p>
						<h2>How can I help?</h2>
						<p>
							Ask about grade boundaries, explore subject trends, or attach a results screenshot to
							fill your calculator.
						</p>
					</div>
					<div class="suggestions">
						{#each SUGGESTIONS as suggestion}
							<button class="prompt-card" type="button" on:click={() => send(suggestion.prompt)}>
								<span class="prompt-icon" aria-hidden="true">{suggestion.icon}</span>
								<span><small>{suggestion.label}</small>{suggestion.prompt}</span>
								<span class="prompt-arrow" aria-hidden="true">→</span>
							</button>
						{/each}
					</div>
				{/if}
				{#each turns as t}
					{#if t.role === 'user'}
						<div class="turn user-turn">
							<div class="msg user">
								{#if t.image}<img class="userImg" src={t.image} alt="Attached" />{/if}
								{t.content}
							</div>
						</div>
					{:else}
						<div class="turn assistant-turn">
							<div class="assistant-avatar" aria-hidden="true">✦</div>
							<div class="assistant-content">
								{#each t.parts as p}
									{#if p.kind === 'tool'}
										<div class="tool {p.status}">
											<span class="tool-icon">
												{#if p.status === 'running'}<span
														class="spinner"
													/>{:else if p.status === 'ok'}✓{:else}!{/if}
											</span>
											<span class="tool-label"
												>{p.label}{#if p.summary && p.status !== 'ok'} — {p.summary}{/if}</span
											>
											{#if p.cached}<span class="tool-badge">cached</span>{/if}
										</div>
									{:else if p.kind === 'chart'}
										<ChatChart title={p.title} labels={p.labels} datasets={p.datasets} />
									{:else if p.content}
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										<div class="msg assistant">{@html render(p.content)}</div>
									{/if}
								{/each}
								{#if loading && t === turns[turns.length - 1] && !t.parts.length}
									<div class="thinking"><span /><span /><span /></div>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			</div>
			<div class="composer-area">
				{#if pendingImage}
					<div class="imagePreview">
						<img src={pendingImage} alt="Attached" />
						<div><strong>Image attached</strong><span>Ready for analysis</span></div>
						<button type="button" on:click={() => (pendingImage = null)} aria-label="Remove image"
							>✕</button
						>
					</div>
				{/if}
				{#if pendingImageError}<div class="imageError">{pendingImageError}</div>{/if}
				<form class="composer" on:submit|preventDefault={() => send()}>
					<input
						type="file"
						accept="image/*"
						bind:this={fileInput}
						on:change={onFileChange}
						style="display:none"
					/>
					<textarea
						rows="2"
						placeholder="Ask IB Predict anything…"
						bind:value={input}
						on:keydown={onKeydown}
						maxlength="2000"
					/>
					<div class="composer-footer">
						<div class="composer-tools">
							<button
								type="button"
								class="composer-button"
								on:click={() => fileInput.click()}
								aria-label="Attach image"
								title="Attach image"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 1 1-2.8-2.8l8.4-8.4"
									/>
								</svg>
							</button>
							<span>Attach results</span>
						</div>
						<button
							class="send-button"
							type="submit"
							disabled={loading || (!input.trim() && !pendingImage)}
							aria-label="Send message"
						>
							{#if loading}<span class="send-spinner" />{:else}<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><path d="m5 12 14-7-4 14-3-6Z" /><path d="m12 13 7-8" /></svg
								>{/if}
						</button>
					</div>
				</form>
				<p class="disclaimer">AI can make mistakes. Verify important exam information.</p>
			</div>
		</div>
	{/if}

	<button
		class="fab"
		on:click={() => (open = !open)}
		aria-label={open ? 'Close chat' : 'Open chat'}
	>
		{#if open}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		{:else}
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linejoin="round"
			>
				<path
					d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z"
				/>
			</svg>
		{/if}
	</button>
</div>

<style lang="scss">
	.chat-root {
		position: fixed;
		bottom: 24px;
		right: 24px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 14px;
	}

	.fab {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		border: 1px solid color-mix(in srgb, var(--color-primary) 62%, transparent);
		background: linear-gradient(145deg, var(--color-primary), var(--color-primary-dark));
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 14px 35px color-mix(in srgb, var(--color-primary-dark) 28%, transparent);
		transition: transform 0.2s ease, box-shadow 0.2s ease;

		svg {
			width: 24px;
			height: 24px;
		}

		&:hover {
			transform: translateY(-3px) scale(1.02);
			box-shadow: 0 18px 40px color-mix(in srgb, var(--color-primary-dark) 36%, transparent);
		}
	}

	.panel ~ .fab {
		display: none;
	}

	.panel {
		width: min(480px, calc(100vw - 48px));
		height: min(720px, calc(100dvh - 48px));
		display: flex;
		flex-direction: column;
		background: color-mix(in srgb, var(--color-surface) 96%, var(--color-bg));
		border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
		border-radius: 24px;
		box-shadow: 0 30px 80px rgba(15, 23, 42, 0.22), 0 4px 18px rgba(15, 23, 42, 0.1);
		overflow: hidden;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 72px;
		padding: 12px 16px 12px 18px;
		background: color-mix(in srgb, var(--color-surface) 94%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
		backdrop-filter: blur(18px);

		.identity {
			display: flex;
			align-items: center;
			gap: 11px;
		}

		.brand-mark {
			display: grid;
			place-items: center;
			width: 38px;
			height: 38px;
			border-radius: 12px;
			background: color-mix(in srgb, var(--color-primary) 14%, var(--color-surface));
			color: var(--color-primary-dark);

			svg {
				width: 22px;
				height: 22px;
			}
		}

		.title {
			color: var(--color-text-main);
			font-family: var(--font-heading);
			font-size: 0.98rem;
			font-weight: 750;
			letter-spacing: -0.015em;
		}

		.subtitle {
			display: flex;
			align-items: center;
			gap: 5px;
			margin-top: 2px;
			color: var(--color-text-muted);
			font-size: 0.7rem;

			> span:last-child {
				margin-left: 2px;
				border-radius: 999px;
				padding: 1px 6px;
				background: color-mix(in srgb, var(--color-primary) 14%, transparent);
				color: var(--color-primary-dark);
				font-size: 0.62rem;
				font-weight: 750;
				text-transform: uppercase;
			}
		}

		.status-dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: #48a868;
			box-shadow: 0 0 0 3px color-mix(in srgb, #48a868 14%, transparent);
		}

		.header-actions {
			display: flex;
			gap: 4px;
		}

		.icon-button {
			display: grid;
			place-items: center;
			width: 36px;
			height: 36px;
			border: 0;
			border-radius: 10px;
			background: transparent;
			color: var(--color-text-muted);
			cursor: pointer;
			transition: background-color 0.15s ease, color 0.15s ease;

			svg {
				width: 18px;
				height: 18px;
			}

			&:hover,
			&:focus-visible {
				background: var(--color-surface-variant);
				color: var(--color-text-main);
			}
		}
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 26px 24px 18px;
		display: flex;
		flex-direction: column;
		gap: 22px;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}

	.welcome {
		padding: 18px 8px 4px;
		text-align: center;

		.welcome-mark {
			display: grid;
			place-items: center;
			width: 52px;
			height: 52px;
			margin: 0 auto 18px;
			border: 1px solid color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
			border-radius: 17px;
			background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
			color: var(--color-primary-dark);

			svg {
				width: 29px;
				height: 29px;
			}
		}

		.welcome-kicker {
			margin: 0 0 7px;
			color: var(--color-primary-dark);
			font-size: 0.69rem;
			font-weight: 800;
			letter-spacing: 0.11em;
			text-transform: uppercase;
		}

		h2 {
			margin: 0;
			color: var(--color-text-main);
			font-family: var(--font-heading);
			font-size: 1.7rem;
			font-weight: 760;
			letter-spacing: -0.035em;
		}

		> p:last-child {
			max-width: 350px;
			margin: 10px auto 0;
			color: var(--color-text-muted);
			font-size: 0.86rem;
			line-height: 1.55;
		}
	}

	.suggestions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 9px;
	}

	.prompt-card {
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr) 14px;
		gap: 9px;
		align-items: center;
		min-height: 84px;
		border: 1px solid var(--color-border);
		border-radius: 15px;
		padding: 12px;
		background: color-mix(in srgb, var(--color-surface) 80%, var(--color-bg));
		color: var(--color-text-main);
		text-align: left;
		font: inherit;
		font-size: 0.79rem;
		line-height: 1.35;
		cursor: pointer;
		transition: transform 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;

		.prompt-icon {
			display: grid;
			place-items: center;
			width: 29px;
			height: 29px;
			border-radius: 9px;
			background: var(--color-surface-variant);
			color: var(--color-primary-dark);
			font-size: 0.88rem;
			font-weight: 800;
		}

		small {
			display: block;
			margin-bottom: 3px;
			color: var(--color-text-muted);
			font-size: 0.64rem;
			font-weight: 750;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}

		.prompt-arrow {
			color: var(--color-text-muted);
			opacity: 0;
			transform: translateX(-3px);
			transition: opacity 0.18s ease, transform 0.18s ease;
		}

		&:hover,
		&:focus-visible {
			border-color: color-mix(in srgb, var(--color-primary) 50%, var(--color-border));
			background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface));
			transform: translateY(-2px);

			.prompt-arrow {
				opacity: 1;
				transform: translateX(0);
			}
		}
	}

	.turn {
		display: flex;
		width: 100%;
	}

	.user-turn {
		justify-content: flex-end;
	}

	.assistant-turn {
		align-items: flex-start;
		gap: 11px;
	}

	.assistant-avatar {
		display: grid;
		flex: 0 0 28px;
		place-items: center;
		width: 28px;
		height: 28px;
		margin-top: 2px;
		border-radius: 9px;
		background: color-mix(in srgb, var(--color-primary) 13%, var(--color-surface));
		color: var(--color-primary-dark);
		font-size: 0.76rem;
	}

	.assistant-content {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 9px;
	}

	.msg {
		max-width: 87%;
		font-size: 0.88rem;
		line-height: 1.62;
		overflow-wrap: break-word;

		&.user {
			border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
			border-radius: 16px 16px 5px 16px;
			padding: 10px 14px;
			background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface-variant));
			color: var(--color-text-main);
			white-space: pre-wrap;
		}

		&.assistant {
			max-width: 100%;
			padding: 3px 0;
			color: var(--color-text-main);

			:global(p) {
				margin: 0 0 0.5em;
			}
			:global(p:last-child) {
				margin-bottom: 0;
			}
			:global(a) {
				color: var(--color-primary-dark, var(--color-primary));
				text-decoration: underline;
				text-underline-offset: 3px;
				user-select: auto;
			}
			:global(ul) {
				margin: 0.25em 0;
				padding-left: 1.2em;
			}
			:global(table) {
				display: block;
				overflow-x: auto;
				border-collapse: collapse;
				margin: 0.65em 0;
				font-size: 0.8rem;
			}
			:global(th),
			:global(td) {
				border: 1px solid var(--color-border);
				padding: 3px 8px;
				text-align: center;
			}
			:global(th) {
				background-color: var(--color-surface);
			}
		}
	}

	.tool {
		display: flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		max-width: 100%;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		padding: 7px 10px;
		background: color-mix(in srgb, var(--color-surface-variant) 55%, transparent);
		color: var(--color-text-muted);
		font-size: 0.72rem;

		&.error {
			border-color: #d66;
		}

		.tool-icon {
			display: grid;
			place-items: center;
			width: 17px;
			height: 17px;
			border-radius: 5px;
			background: var(--color-surface);
			color: #48a868;
		}

		&.running .tool-icon {
			color: var(--color-primary-dark);
		}

		&.error .tool-icon {
			color: #d66;
		}

		.tool-badge {
			font-size: 0.62rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			padding: 2px 6px;
			border-radius: var(--radius-full);
			background-color: var(--color-surface-variant);
			color: var(--color-text-muted);
		}
	}

	.spinner {
		width: 9px;
		height: 9px;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.thinking {
		display: flex;
		gap: 4px;
		padding: 9px 0;

		span {
			width: 5px;
			height: 5px;
			border-radius: 50%;
			background: var(--color-text-muted);
			animation: pulse-dot 1.1s infinite ease-in-out;

			&:nth-child(2) {
				animation-delay: 0.14s;
			}

			&:nth-child(3) {
				animation-delay: 0.28s;
			}
		}
	}

	@keyframes pulse-dot {
		0%,
		60%,
		100% {
			opacity: 0.35;
			transform: translateY(0);
		}
		30% {
			opacity: 1;
			transform: translateY(-3px);
		}
	}

	.imagePreview {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 7px 9px;
		background: var(--color-surface-variant);

		img {
			width: 38px;
			height: 38px;
			border-radius: 8px;
			border: 1px solid var(--color-border);
			object-fit: cover;
		}

		div {
			display: flex;
			min-width: 0;
			flex: 1;
			flex-direction: column;
			font-size: 0.72rem;

			span {
				color: var(--color-text-muted);
			}
		}

		button {
			background: none;
			border: none;
			cursor: pointer;
			color: var(--color-text-muted);
		}
	}

	.imageError {
		font-size: 0.75rem;
		color: #d66;
		padding: 0 3px 7px;
	}

	.userImg {
		max-width: 100%;
		border-radius: var(--radius-sm);
		margin-bottom: 7px;
		display: block;
	}

	.composer-area {
		position: relative;
		padding: 10px 16px 12px;
		background: linear-gradient(to bottom, transparent, var(--color-surface) 18%);
	}

	.composer {
		border: 1px solid color-mix(in srgb, var(--color-border) 90%, transparent);
		border-radius: 17px;
		padding: 7px;
		background: var(--color-surface);
		box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
		transition: border-color 0.18s ease, box-shadow 0.18s ease;

		&:focus-within {
			border-color: color-mix(in srgb, var(--color-primary) 48%, var(--color-border));
			box-shadow: 0 8px 28px color-mix(in srgb, var(--color-primary) 9%, transparent);
		}

		textarea {
			display: block;
			width: 100%;
			min-height: 52px;
			max-height: 150px;
			box-sizing: border-box;
			resize: none;
			border: 0;
			padding: 8px 9px 4px;
			background: transparent;
			color: var(--color-text-main);
			font-family: var(--font-body);
			font-size: 0.9rem;
			line-height: 1.45;
			outline: none;

			&::placeholder {
				color: color-mix(in srgb, var(--color-text-muted) 75%, transparent);
			}
		}
	}

	.composer-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 3px 3px 2px 5px;
	}

	.composer-tools {
		display: flex;
		align-items: center;
		gap: 6px;
		color: var(--color-text-muted);
		font-size: 0.68rem;
	}

	.composer-button,
	.send-button {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		cursor: pointer;

		svg {
			width: 17px;
			height: 17px;
		}
	}

	.composer-button {
		border: 0;
		background: transparent;
		color: var(--color-text-muted);

		&:hover,
		&:focus-visible {
			background: var(--color-surface-variant);
			color: var(--color-text-main);
		}
	}

	.send-button {
		border: 0;
		background: var(--color-text-main);
		color: var(--color-surface);
		transition: transform 0.16s ease, opacity 0.16s ease;

		&:not(:disabled):hover {
			transform: scale(1.05);
		}

		&:disabled {
			opacity: 0.22;
			cursor: default;
		}
	}

	.send-spinner {
		width: 11px;
		height: 11px;
		border: 2px solid currentColor;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	.disclaimer {
		margin: 7px 0 0;
		color: var(--color-text-muted);
		font-size: 0.61rem;
		text-align: center;
	}

	@media (max-width: 540px) {
		.chat-root {
			right: 0;
			bottom: 0;
		}

		.panel {
			width: 100vw;
			height: 100dvh;
			border: 0;
			border-radius: 0;
		}

		.messages {
			padding: 20px 16px 16px;
		}

		.suggestions {
			grid-template-columns: 1fr;
		}

		.prompt-card {
			min-height: 68px;
		}

		.composer-area {
			padding-right: 10px;
			padding-bottom: max(10px, env(safe-area-inset-bottom));
			padding-left: 10px;
		}
	}
</style>
