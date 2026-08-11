import OpenAI from 'openai';
import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import knowledge from '$lib/chatbot/knowledge.md?raw';

import M19 from '$lib/assets/M19.json';
import N19 from '$lib/assets/N19.json';
import N20 from '$lib/assets/N20.json';
import M21 from '$lib/assets/M21.json';
import M22 from '$lib/assets/M22.json';
import N22 from '$lib/assets/N22.json';
import M23 from '$lib/assets/M23.json';
import N23 from '$lib/assets/N23.json';
import M24 from '$lib/assets/M24.json';
import N24 from '$lib/assets/N24.json';
import M25 from '$lib/assets/M25.json';
import N25 from '$lib/assets/N25.json';

const SESSIONS = { M19, N19, N20, M21, M22, N22, M23, N23, M24, N24, M25, N25 };
const LATEST = 'M25';

const MODEL = env.OPENAI_MODEL || 'gpt-4o';
const MAX_MESSAGES = 30;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_TOOL_ROUNDS = 4;
const COVID_SESSIONS = ['N20', 'M21', 'N21', 'M22'];

// Simple in-memory per-IP rate limit: 20 requests per 5 minutes
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const hits = new Map();

/* ---------- per-conversation tool result cache ----------
   Two jobs: skip repeat lookups, and hand prior results back to the model so
   follow-ups ("what about SL?") are answered without another tool round trip.
   In-memory and best-effort — on serverless/edge a cold isolate just misses. */
const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_CONVERSATIONS = 500;
const MAX_ENTRIES_PER_CONVO = 12;
const MAX_INJECTED_ENTRIES = 3;
const convoCache = new Map();

const cacheKey = (name, args) =>
	name +
	':' +
	JSON.stringify(
		Object.keys(args || {})
			.sort()
			.map((k) => [k, String(args[k]).trim().toLowerCase()])
	);

function getConvo(id) {
	const now = Date.now();
	for (const [key, convo] of convoCache) {
		if (now - convo.ts > CACHE_TTL_MS) convoCache.delete(key);
	}
	let convo = convoCache.get(id);
	if (!convo) {
		if (convoCache.size >= MAX_CONVERSATIONS) convoCache.delete(convoCache.keys().next().value);
		convo = { ts: now, entries: new Map() };
	} else {
		convoCache.delete(id); // re-insert so iteration order is least-recently-used first
	}
	convo.ts = now;
	convoCache.set(id, convo);
	return convo;
}

function cacheGet(convo, name, args) {
	return convo?.entries.get(cacheKey(name, args))?.result;
}

function cacheSet(convo, name, args, result) {
	if (!convo || result?.error) return; // never cache failures
	const key = cacheKey(name, args);
	convo.entries.delete(key);
	if (convo.entries.size >= MAX_ENTRIES_PER_CONVO) {
		convo.entries.delete(convo.entries.keys().next().value);
	}
	convo.entries.set(key, { name, args, result });
}

// Compact prior results into a system message the model can answer follow-ups from
function cachedContext(convo) {
	if (!convo?.entries.size) return null;
	const recent = [...convo.entries.values()].slice(-MAX_INJECTED_ENTRIES);
	const payload = recent.map(({ name, args, result }) => {
		const trimmed = { ...result };
		// Per-timezone detail is bulky; the averaged thresholds carry the analysis
		if (Array.isArray(trimmed.sessions)) {
			trimmed.sessions = trimmed.sessions.map(({ per_timezone, ...rest }) => rest);
		}
		return { tool: name, arguments: args, result: trimmed };
	});
	return (
		'Data already retrieved earlier in this conversation. Reuse it to answer follow-up ' +
		'questions instead of calling the same tool again with the same arguments. Call a tool ' +
		'only when the user asks about a subject, level, or session not covered here.\n' +
		JSON.stringify(payload)
	);
}

function rateLimited(ip) {
	const now = Date.now();
	const timestamps = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
	if (timestamps.length >= RATE_LIMIT) return true;
	timestamps.push(now);
	hits.set(ip, timestamps);
	return false;
}

/* ---------- grade boundary lookup tool ---------- */

const ALIASES = [
	[/l\s*&\s*l|langlit|lang\s*lit/g, ' language and literature '],
	[/\bmath\b/g, ' mathematics '],
	[/\baa\b/g, ' analysis and approaches '],
	[/\bai\b/g, ' applications and interpretation '],
	[/\bess\b/g, ' environmental systems and societies '],
	[/\bbm\b/g, ' business management '],
	[/\bpsych\b/g, ' psychology '],
	[/\bbio\b/g, ' biology '],
	[/\bchem\b/g, ' chemistry '],
	[/\bphys\b/g, ' physics '],
	[/\becon\b/g, ' economics '],
	[/\btok\b/g, ' theory of knowledge '],
	[/\bee\b/g, ' extended essay ']
];

function tokens(s) {
	s = ' ' + s.toLowerCase() + ' ';
	for (const [re, sub] of ALIASES) s = s.replace(re, sub);
	return s.replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
}

function matchSubject(data, query, level) {
	const qTokens = tokens(query).filter((t) => t !== 'hl' && t !== 'sl');
	let best = null;
	const scored = [];
	for (const key of Object.keys(data)) {
		if (key === 'info') continue;
		const keyLevel = key.startsWith('HL ') ? 'HL' : key.startsWith('SL ') ? 'SL' : null;
		if (level && keyLevel && keyLevel !== level) continue;
		const kTokens = tokens(key);
		let matched = 0;
		for (const q of qTokens) {
			if (kTokens.some((k) => k === q || (q.length >= 3 && k.startsWith(q)) || (k.length >= 3 && q.startsWith(k)))) matched++;
		}
		const score = qTokens.length ? matched / qTokens.length : 0;
		scored.push({ key, score, len: kTokens.length });
		if (score > 0 && (!best || score > best.score || (score === best.score && kTokens.length < best.len))) {
			best = { key, score, len: kTokens.length };
		}
	}
	if (best && best.score >= 0.6) return { match: best.key };
	return {
		match: null,
		candidates: scored
			.sort((a, b) => b.score - a.score || a.len - b.len)
			.slice(0, 8)
			.map((s) => s.key)
	};
}

function getGradeBoundaries({ subject, level, session }) {
	const sess = (session || LATEST).toUpperCase();
	const data = SESSIONS[sess];
	if (!data) {
		return { error: `Unknown session "${session}". Available: ${Object.keys(SESSIONS).join(', ')}. (M20 was cancelled; N21 is unavailable.)` };
	}
	const lvl = level ? level.toUpperCase() : null;
	const { match, candidates } = matchSubject(data, subject, lvl === 'HL' || lvl === 'SL' ? lvl : null);
	if (!match) {
		return { error: `No subject matched "${subject}" in ${sess}.`, similar_subjects: candidates };
	}
	const tzArrays = data[match].TZ.filter((tz) => tz.length > 0);
	const boundaries = {};
	tzArrays.forEach((tz, i) => {
		boundaries[tzArrays.length === 1 ? 'TZ0' : `TZ${i + 1}`] = tz;
	});
	return {
		session: data.info.name,
		subject: match,
		note: 'Each array lists the minimum mark out of 100 required for grades 1-7 (or E-A for TOK/EE), in order. TZ = timezone variant of the exam.',
		boundaries
	};
}

const round1 = (n) => Math.round(n * 10) / 10;
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// Least-squares slope of y over evenly spaced x — marks gained/lost per session
function slope(ys) {
	if (ys.length < 2) return 0;
	const xs = ys.map((_, i) => i);
	const mx = mean(xs);
	const my = mean(ys);
	const num = xs.reduce((acc, x, i) => acc + (x - mx) * (ys[i] - my), 0);
	const den = xs.reduce((acc, x) => acc + (x - mx) ** 2, 0);
	return den === 0 ? 0 : num / den;
}

function describeTrend(s) {
	if (s > 0.75) return 'rising clearly';
	if (s > 0.25) return 'drifting up slightly';
	if (s < -0.75) return 'falling clearly';
	if (s < -0.25) return 'drifting down slightly';
	return 'broadly flat';
}

function getBoundaryHistory({ subject, level }) {
	const lvl = level ? level.toUpperCase() : null;
	const { match, candidates } = matchSubject(SESSIONS[LATEST], subject, lvl === 'HL' || lvl === 'SL' ? lvl : null);
	if (!match) {
		return { error: `No subject matched "${subject}".`, similar_subjects: candidates };
	}

	const isCore = match === 'Theory Of Knowledge' || match === 'Extended Essay';
	const topLabel = isCore ? 'A' : '7';
	const midLabel = isCore ? 'C' : '4';

	const sessions = [];
	for (const [code, data] of Object.entries(SESSIONS)) {
		// Re-match per session so renamed/older course names still resolve
		const key = data[match] ? match : matchSubject(data, match, null).match;
		const tzArrays = key && data[key] ? data[key].TZ.filter((tz) => tz.length > 0) : [];
		if (!tzArrays.length) continue;

		// Average each grade threshold across timezones
		const width = Math.min(...tzArrays.map((tz) => tz.length));
		const avg = [];
		for (let i = 0; i < width; i++) avg.push(round1(mean(tzArrays.map((tz) => tz[i]))));

		sessions.push({
			session: code,
			name: data.info.name,
			timezones: tzArrays.length,
			covid_affected: COVID_SESSIONS.includes(code),
			[`grade_${topLabel}_min`]: avg[avg.length - 1],
			[`grade_${midLabel}_min`]: avg[isCore ? 2 : 3],
			all_thresholds: avg,
			per_timezone: tzArrays.length > 1 ? tzArrays : undefined
		});
	}

	if (!sessions.length) return { error: `No boundary data found for ${match}.` };

	const top = sessions.map((s) => s[`grade_${topLabel}_min`]);
	const mid = sessions.map((s) => s[`grade_${midLabel}_min`]);
	const recent = sessions.filter((s) => !s.covid_affected);
	const recentTop = recent.map((s) => s[`grade_${topLabel}_min`]);

	const analysis = {
		sessions_covered: `${sessions[0].session} to ${sessions[sessions.length - 1].session} (${sessions.length} sessions)`,
		[`grade_${topLabel}`]: {
			first: top[0],
			latest: top[top.length - 1],
			change_overall: round1(top[top.length - 1] - top[0]),
			min: Math.min(...top),
			max: Math.max(...top),
			average: round1(mean(top)),
			volatility_range: round1(Math.max(...top) - Math.min(...top)),
			trend_per_session: round1(slope(top)),
			trend: describeTrend(slope(top))
		},
		[`grade_${midLabel}`]: {
			latest: mid[mid.length - 1],
			average: round1(mean(mid)),
			trend_per_session: round1(slope(mid)),
			trend: describeTrend(slope(mid))
		},
		excluding_covid_sessions: recentTop.length
			? {
					sessions: recent.map((s) => s.session).join(', '),
					[`grade_${topLabel}_average`]: round1(mean(recentTop)),
					[`grade_${topLabel}_trend`]: describeTrend(slope(recentTop)),
					trend_per_session: round1(slope(recentTop))
			  }
			: null
	};

	return {
		subject: match,
		analysis,
		sessions,
		guidance: `A chart of these boundaries is ALREADY displayed to the user above your reply — do not describe the chart or say you cannot draw one. Cite concrete numbers from the analysis. COVID-affected sessions (${COVID_SESSIONS.join(', ')}) had unusually low boundaries and skew any average. M20 was cancelled and N21 data is unavailable. Never state a definite prediction for a future session.`,
		chart: {
			title: `${match} — grade ${topLabel} & ${midLabel} boundaries by session`,
			labels: sessions.map((s) => s.session),
			datasets: [
				{ label: `Grade ${topLabel}`, data: top },
				{ label: `Grade ${midLabel}`, data: mid }
			]
		}
	};
}

const TOOLS = [
	{
		type: 'function',
		function: {
			name: 'get_grade_boundaries',
			description:
				'Look up official IB grade boundaries for a subject in a given exam session. Returns the minimum mark (out of 100) needed for each grade 1-7, per exam timezone (TZ).',
			parameters: {
				type: 'object',
				properties: {
					subject: {
						type: 'string',
						description: 'Subject name, e.g. "English A Language and Literature", "Mathematics Analysis and Approaches", "Theory of Knowledge"'
					},
					level: { type: 'string', enum: ['HL', 'SL'], description: 'Level. Omit for TOK/EE.' },
					session: {
						type: 'string',
						description: 'Exam session code: M=May, N=November + 2-digit year, e.g. "M25", "N23". Available M19-N25 (no M20, no N21). Defaults to the latest (M25).'
					}
				},
				required: ['subject']
			}
		}
	},
	{
		type: 'function',
		function: {
			name: 'get_boundary_history',
			description:
				'Get grade boundaries for a subject across ALL available exam sessions (2019-2025) in one call. Use this for questions about trends, changes over time, or whether boundaries are likely to rise or fall.',
			parameters: {
				type: 'object',
				properties: {
					subject: { type: 'string', description: 'Subject name' },
					level: { type: 'string', enum: ['HL', 'SL'], description: 'Level. Omit for TOK/EE.' }
				},
				required: ['subject']
			}
		}
	},

	{
		type: 'function',
		function: {
			name: 'set_subject_marks',
			description:
				"Fill in the on-page calculator with a subject's marks — use this after reading an uploaded results image, or when the user tells you their marks directly in chat. Call once per subject (you can call it multiple times in one turn for multiple subjects). Only include marks you can actually read clearly — omit a component entirely rather than guessing at a number.",
			parameters: {
				type: 'object',
				properties: {
					subject: { type: 'string', description: 'Exact subject name as it appears on the site, e.g. "Chemistry", "Mathematics: Analysis And Approaches"' },
					level: { type: 'string', enum: ['HL', 'SL'] },
					language: { type: 'string', description: 'Only for language subjects, e.g. "English"' },
					scores: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								component: { type: 'string', description: 'Component name, e.g. "Paper 1a", "Individual Investigation" — match as closely as possible to standard IB component names' },
								mark: { type: 'number' }
							},
							required: ['component', 'mark']
						}
					}
				},
				required: ['subject', 'level', 'scores']
			}
		}
	}
];

/* ---------- chat endpoint ---------- */

const SYSTEM_PROMPT = `You are the IB Predict assistant, an analyst embedded on ibpredict.org that helps students and teachers use the site and understand IB grade boundary data.

## Scope
- Only handle IB Predict, the IB Diploma Programme as it relates to the site (scoring, grade boundaries, diploma requirements), and site navigation. Politely decline anything else.
- Base non-boundary answers strictly on the knowledge base below. Link pages as relative markdown, e.g. [Math AA](/subjects/analysis-and-approaches).
- Send bug reports and corrections to admin@ibpredict.org.

## Tools
- Specific boundary numbers for one session -> get_grade_boundaries. Never answer these from memory.
- Trends over time, "has it changed", "will it go up or down" -> get_boundary_history.
- If a tool returns similar_subjects, retry with the closest name or ask which they meant.

## Filling in the calculator
When a user attaches a results/report image, or tells you their subjects and marks directly:
- Transcribe ONLY subjects and components that are literally printed in the image or stated by the user. NEVER add a subject that isn't visibly present — if you find yourself filling in what a "typical" IB report usually contains rather than reading this specific one, stop.
- Before calling any tool, mentally list every subject heading exactly as printed, and don't exceed that count.
- Reports often show multiple numeric columns (e.g. Raw mark, Moderated mark, Scaled mark) plus a Grade. Use the mark that is out of the component's real maximum — usually the "Moderated mark" column — never the Scaled/weighted score, and never the Grade letter/number.
- If a component's name doesn't clearly correspond to a standard component for that subject, or you're unsure of the exact number, omit it rather than guessing.
- Call set_subject_marks once per subject you can confidently read — you can make several calls in the same turn.
- For the Extended Essay, always call set_subject_marks with subject: "Extended Essay" — never the essay's topic subject (a report may label the row "Physics EE" or similar; that still means Extended Essay, not Physics).
- For Theory of Knowledge, call set_subject_marks with subject: "Theory Of Knowledge", level: "SL", and components named after what's printed (e.g. "Theory of Knowledge" for the essay, "TOK Exhibition" for the exhibition).- After calling the tool(s), summarize in your reply what you set for each subject, and ask the user to double-check it against their actual report — you're reading images, and misreads happen.

## Answering — this is what separates a useful answer from a useless one
NEVER write a section heading you do not immediately fill with real numbers. An empty heading like "May Sessions" with nothing under it is a broken answer.
Every claim must carry a figure from the tool result. Write "the grade 7 threshold sat at 68 in M23 and 71 in M25" — never "boundaries have fluctuated".
Lead with the direct answer, then the evidence.

For a trend question, in this order:
1. One sentence answering it outright, with the headline numbers (latest value, overall change, trend direction).
2. Two to four bullets of specific evidence: the range (min to max, and which sessions), what changes once COVID sessions are excluded, and any May vs November difference worth noting.
3. One short caveat: boundaries are set each session against candidate performance, so past data indicates but does not determine the next session. Point to the subject page probability graphs.
A chart is rendered automatically above your reply whenever you call get_boundary_history — never say you cannot show a graph, and do not describe the chart's appearance.

For "will it go up or down", commit to the most likely direction with a confidence level, grounded in the trend figure, then give the caveat. Do not refuse to answer.

For a single-session lookup, give a compact markdown table (Grade | Minimum mark), one per timezone when they differ, plus a one-line takeaway.

Keep it tight: under 150 words unless asked to go deeper. Friendly, plain language, no filler openers.

<knowledge_base>
${knowledge}
</knowledge_base>`;

export async function POST({ request, getClientAddress }) {
	if (!env.OPENAI_API_KEY) throw error(500, 'Chat is not configured');
	if (rateLimited(getClientAddress())) throw error(429, 'Too many requests — try again soon');

	let body;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const messages = Array.isArray(body?.messages) ? body.messages.slice(-MAX_MESSAGES) : null;
	if (
		!messages?.length ||
		!messages.every(
			(m) =>
				(m.role === 'user' || m.role === 'assistant') &&
				typeof m.content === 'string' &&
				m.content.length > 0 &&
				m.content.length <= MAX_MESSAGE_LENGTH
		) ||
		messages[messages.length - 1].role !== 'user'
	) {
		throw error(400, 'Invalid messages');
	}

	const rawId = typeof body?.conversationId === 'string' ? body.conversationId : '';
	const conversationId = /^[A-Za-z0-9_-]{8,64}$/.test(rawId) ? rawId : null;
	const cache = conversationId ? getConvo(conversationId) : null;

	const rawImage = typeof body?.image === 'string' ? body.image : null;
	const image =
		rawImage && /^data:image\/(png|jpe?g|webp);base64,/.test(rawImage) && rawImage.length <= 7_000_000
			? rawImage
			: null;

	const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
	const encoder = new TextEncoder();

	const stream = new ReadableStream({
		async start(controller) {
			const emit = (obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
			const priorData = cachedContext(cache);
			const lastMessages = image
				? [
						...messages.slice(0, -1),
						{
							role: 'user',
							content: [
								{ type: 'text', text: messages[messages.length - 1].content },
								{ type: 'image_url', image_url: { url: image, detail: 'high' } }
							]
						}
				  ]
				: messages;
			const convo = [
				{ role: 'system', content: SYSTEM_PROMPT },
				...(priorData ? [{ role: 'system', content: priorData }] : []),
				...lastMessages
			];

			try {
				for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
					const lastRound = round === MAX_TOOL_ROUNDS;
					const apiStream = await openai.chat.completions.create({
						model: MODEL,
						max_tokens: 1024,
						stream: true,
						messages: convo,
						...(lastRound ? {} : { tools: TOOLS })
					});

					// Accumulate assistant text and any tool calls from the stream
					let text = '';
					const toolCalls = [];
					for await (const chunk of apiStream) {
						const delta = chunk.choices[0]?.delta;
						if (!delta) continue;
						if (delta.content) {
							text += delta.content;
							emit({ type: 'text', delta: delta.content });
						}
						for (const tc of delta.tool_calls || []) {
							if (!toolCalls[tc.index]) {
								toolCalls[tc.index] = { id: tc.id, name: '', args: '' };
							}
							if (tc.id) toolCalls[tc.index].id = tc.id;
							if (tc.function?.name) toolCalls[tc.index].name += tc.function.name;
							if (tc.function?.arguments) toolCalls[tc.index].args += tc.function.arguments;
						}
					}

					if (!toolCalls.length) break;

					convo.push({
						role: 'assistant',
						content: text || null,
						tool_calls: toolCalls.map((tc) => ({
							id: tc.id,
							type: 'function',
							function: { name: tc.name, arguments: tc.args }
						}))
					});

					for (const tc of toolCalls) {
						let args = {};
						try {
							args = JSON.parse(tc.args);
						} catch {}
						const label =
							tc.name === 'get_grade_boundaries'
								? `Looking up ${[args.session || 'M25', args.level, args.subject].filter(Boolean).join(' ')} boundaries`
								: tc.name === 'get_boundary_history'
								? `Fetching ${[args.level, args.subject].filter(Boolean).join(' ')} boundaries for all sessions`
								: `Running ${tc.name}`;
						emit({ type: 'tool_start', id: tc.id, name: tc.name, label });

						let result = cacheGet(cache, tc.name, args);
						const hit = result !== undefined;
						if (!hit) {
							try {
								if (tc.name === 'get_grade_boundaries') {
									result = getGradeBoundaries(args);
								} else if (tc.name === 'get_boundary_history') {
									result = getBoundaryHistory(args);
								} else if (tc.name === 'set_subject_marks') {
									result = { ok: true, note: "Applied on the user's device — tell them what you set and ask them to double-check it." };
									emit({ type: 'client_action', action: 'set_subject_marks', ...args });
								} else {
									result = { error: `Unknown tool ${tc.name}` };
								}
							} catch (e) {
								result = { error: String(e) };
							}
							if (tc.name !== 'set_subject_marks') cacheSet(cache, tc.name, args, result);
						}
						emit({
							type: 'tool_end',
							id: tc.id,
							ok: !result.error,
							cached: hit,
							summary:
								result.error ||
								(result.analysis
									? `${result.subject} — ${result.analysis.sessions_covered}`
									: `${result.subject} — ${result.session}`)
						});

						// The chart renders in the UI; the model gets the numbers, not the spec
						const { chart, ...forModel } = result;
						if (chart) emit({ type: 'chart', id: tc.id, ...chart });
						convo.push({ role: 'tool', tool_call_id: tc.id, content: JSON.stringify(forModel) });
					}
				}
				emit({ type: 'done' });
			} catch (e) {
				console.error('chat error', e);
				emit({ type: 'error', message: 'Sorry, something went wrong. Please try again.' });
			}
			controller.close();
		}
	});

	return new Response(stream, {
		headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store' }
	});
}
