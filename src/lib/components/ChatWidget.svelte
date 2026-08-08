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
		'M25 boundaries for HL Chemistry',
		'Analyze HL Math AA grade boundaries over time',
		'Are HL Physics boundaries likely to go up or down?',
		'Why is my diploma not awarded?'
	];

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

	function normalizeComponent(s) {
		return s
			.toLowerCase()
			.replace(/\(.*?\)/g, ' ')
			.replace(/[^a-z0-9]+/g, ' ')
			.trim();
	}

	function componentTokens(s) {
		return normalizeComponent(s).split(' ').filter(Boolean);
	}

	function matchComponent(assessments, query) {
		const qTokens = componentTokens(query);
		let best = null;
		for (let i = 0; i < assessments.length; i++) {
			const kTokens = componentTokens(assessments[i].name);
			let matched = 0;
			for (const q of qTokens) {
				if (
					kTokens.some(
						(k) =>
							k === q ||
							(q.length >= 2 && k.startsWith(q)) ||
							(k.length >= 2 && q.startsWith(k))
					)
				)
					matched++;
			}
			const score = qTokens.length ? matched / qTokens.length : 0;
			if (score > 0 && (!best || score > best.score)) best = { index: i, score };
		}
		return best && best.score >= 0.5 ? best.index : -1;
	}

	function findGroupForSubject(subject) {
		for (let g = 0; g <= 6; g++) {
			if (get(getPredictorSelectedOptions(g)).subject === subject) return g;
		}
		for (let g = 0; g <= 5; g++) {
			const list = courses.meta[`group${g + 1}`] || [];
			if (list.includes(subject) && !get(getPredictorSelectedOptions(g)).subject) return g;
		}
		return null;
	}

	function applySubjectMarks({ subject, level, language, scores }) {
		const meta = courses[subject];
		if (!meta) return { ok: false, label: `Couldn't find subject "${subject}" on the site` };

		const group = findGroupForSubject(subject);
		if (group === null) return { ok: false, label: `No open slot for ${subject}` };

		const settings = getPredictorSelectedOptions(group);
		const current = get(settings);
		current.subject = subject;
		current.level = level;
		if (language) current.language = language;

		const assessments = meta[level] || [];
		const chosen = current.chosenScores || [];
		let matched = 0;
		for (const { component, mark } of scores) {
			const idx = matchComponent(assessments, component);
			if (idx === -1) continue;
			chosen[idx] = mark;
			matched++;
		}
		current.chosenScores = chosen;
		settings.set(current);

		return { ok: matched > 0, label: `Set ${level} ${subject}`, summary: `${matched}/${scores.length} marks applied` };
	}
		// if (typeof window !== 'undefined') window.applySubjectMarks = applySubjectMarks;
	


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
					} catch {}
				}
				pushText(msg);
			} else {
				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';
				while (true) {
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
							turn.parts.push({ kind: 'tool', label: r.label, status: r.ok ? 'ok' : 'error', summary: r.summary });
						}
						else if (ev.type === 'error') pushText(ev.message);
						
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
				<div>
					<div class="title">IB Predict Assistant <span class="beta">beta</span></div>
				</div>
				<button class="close" on:click={() => (open = false)} aria-label="Close chat">✕</button>
			</div>
			<div class="messages" bind:this={messagesEl}>
				<div class="msg assistant">
					Hi! I can answer questions about the calculator, look up official grade boundaries for
					you, and point you to the right page.
				</div>
				{#if turns.length === 0}
					<div class="suggestions">
						{#each SUGGESTIONS as s}
							<button class="chip" on:click={() => send(s)}>{s}</button>
						{/each}
					</div>
				{/if}
				{#each turns as t}
				{#if t.role === 'user'}
						<div class="msg user">
							{#if t.image}<img class="userImg" src={t.image} alt="Attached" />{/if}
							{t.content}
						</div>
				{:else}
						{#each t.parts as p}
							{#if p.kind === 'tool'}
								<div class="tool {p.status}">
									<span class="tool-icon">
										{#if p.status === 'running'}<span class="spinner" />{:else if p.status === 'ok'}✓{:else}!{/if}
									</span>
									<span class="tool-label">{p.label}{#if p.summary && p.status !== 'ok'} — {p.summary}{/if}</span>
									{#if p.cached}<span class="tool-badge">cached</span>{/if}
								</div>
							{:else if p.kind === 'chart'}
								<ChatChart title={p.title} labels={p.labels} datasets={p.datasets} />
							{:else if p.content}
								<div class="msg assistant">{@html render(p.content)}</div>
							{/if}
						{/each}
						{#if loading && t === turns[turns.length - 1] && !t.parts.length}
							<div class="msg assistant"><span class="typing">…</span></div>
						{/if}
					{/if}
				{/each}
			</div>
			{#if pendingImage}
				<div class="imagePreview">
					<img src={pendingImage} alt="Attached" />
					<button type="button" on:click={() => (pendingImage = null)} aria-label="Remove image">✕</button>
				</div>
			{/if}
			{#if pendingImageError}
				<div class="imageError">{pendingImageError}</div>
			{/if}
			<form class="inputRow" on:submit|preventDefault={() => send()}>
				<input
					type="file"
					accept="image/*"
					bind:this={fileInput}
					on:change={onFileChange}
					style="display:none"
				/>
				<button type="button" class="attach" on:click={() => fileInput.click()} aria-label="Attach image">📎</button>
				<textarea
					rows="1"
					placeholder="Ask a question, or attach your results…"
					bind:value={input}
					on:keydown={onKeydown}
					maxlength="2000"
				/>
				<button type="submit" disabled={loading || (!input.trim() && !pendingImage)}>Send</button>
			</form>
		</div>
	{/if}

	<button class="fab" on:click={() => (open = !open)} aria-label={open ? 'Close chat' : 'Open chat'}>
		{#if open}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">
				<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5Z" />
			</svg>
		{/if}
	</button>
</div>

<style lang="scss">
	.chat-root {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 12px;
	}

	.fab {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: none;
		background-color: var(--color-primary-dark);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: var(--shadow-md);
		transition: background-color 0.15s ease, transform 0.15s ease;

		svg {
			width: 24px;
			height: 24px;
		}

		&:hover {
			background-color: var(--color-primary);
			transform: translateY(-2px);
		}
	}

	.panel {
		width: min(420px, calc(100vw - 40px));
		height: min(580px, calc(100vh - 110px));
		display: flex;
		flex-direction: column;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		overflow: hidden;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background-color: var(--color-surface);
		border-bottom: 1px solid var(--color-border);

		.title {
			font-family: var(--font-heading);
			font-weight: 700;
		}

		.subtitle {
			font-size: 0.72rem;
			color: var(--color-text-muted);
		}

		.beta {
			font-size: 0.7rem;
			font-weight: 600;
			background-color: var(--color-primary);
			color: #000;
			padding: 1px 6px;
			border-radius: 8px;
			vertical-align: middle;
		}

		.close {
			background: none;
			border: none;
			color: var(--color-text-main);
			cursor: pointer;
			font-size: 1rem;
		}
	}

	.messages {
		flex: 1;
		overflow-y: auto;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		color: var(--color-text-muted);
		text-align: left;
		border-radius: 14px;
		padding: 5px 11px;
		font-size: 0.78rem;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			background-color: var(--color-primary);
			color: #000;
		}
	}

	.msg {
		max-width: 88%;
		padding: 8px 12px;
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		line-height: 1.5;
		overflow-wrap: break-word;

		&.user {
			align-self: flex-end;
			background-color: var(--color-primary-dark);
			color: #fff;
			white-space: pre-wrap;
		}

		&.assistant {
			align-self: flex-start;
			background-color: var(--color-bg);
			border: 1px solid var(--color-border);
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
				user-select: auto;
			}
			:global(ul) {
				margin: 0.25em 0;
				padding-left: 1.2em;
			}
			:global(table) {
				border-collapse: collapse;
				margin: 0.4em 0;
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
		align-self: flex-start;
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 0.76rem;
		padding: 4px 10px;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-full);
		background-color: var(--color-surface);
		color: var(--color-text-muted);

		&.error {
			border-color: #d66;
		}

		.tool-icon {
			display: inline-flex;
			width: 12px;
			justify-content: center;
		}

		.tool-badge {
			font-size: 0.62rem;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			padding: 1px 6px;
			border-radius: var(--radius-full);
			background-color: var(--color-surface-variant);
			color: var(--color-text-muted);
		}
	}

	.spinner {
		width: 10px;
		height: 10px;
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

	.typing {
		opacity: 0.6;
	}

	.attach {
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 0 10px;
		cursor: pointer;
		font-size: 1rem;
	}

	.imagePreview {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px;
		img {
			height: 40px;
			border-radius: var(--radius-sm);
			border: 1px solid var(--color-border);
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
		padding: 0 10px;
	}

	.userImg {
		max-width: 100%;
		border-radius: var(--radius-sm);
		margin-bottom: 4px;
		display: block;
	}
	
	.inputRow {
		display: flex;
		gap: 8px;
		padding: 10px;
		border-top: 1px solid var(--color-border);

		textarea {
			flex: 1;
			resize: none;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-md);
			background-color: var(--color-bg);
			color: var(--color-text-main);
			font-family: var(--font-body);
			font-size: 0.875rem;
			padding: 8px 10px;
			outline: none;
		}

		button {
			border: none;
			border-radius: var(--radius-md);
			background-color: var(--color-primary);
			color: #000;
			font-weight: 600;
			padding: 0 14px;
			cursor: pointer;

			&:disabled {
				opacity: 0.5;
				cursor: default;
			}
		}
	}
</style>
