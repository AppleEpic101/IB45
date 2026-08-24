<script>
	export let subject = '';
	export let size = 'medium';

	const iconNames = {
		astronomy: 'planet',
		literature: 'book',
		'language-and-literature': 'book-chat',
		'literature-and-performance': 'book-stage',
		'classical-language': 'column',
		'language-b': 'chat',
		'ab-initio': 'spark-chat',
		'art-history': 'frame',
		'brazilian-social-studies': 'map',
		'business-management': 'briefcase',
		economics: 'trend',
		geography: 'globe',
		'global-politics': 'network',
		history: 'history',
		'digital-society': 'nodes',
		philosophy: 'bulb',
		psychology: 'brain',
		'social-and-cultural-anthropology': 'people',
		'turkey-in-the-20th-century': 'crescent',
		'world-religions': 'compass',
		biology: 'leaf',
		chemistry: 'flask',
		'computer-science': 'code',
		'design-technology': 'ruler',
		'environmental-systems-and-societies': 'eco',
		'marine-science': 'wave',
		'nature-of-science': 'atom-leaf',
		physics: 'atom',
		'sports-excercise-and-health-science': 'pulse',
		'analysis-and-approaches': 'function',
		'applications-and-interpretation': 'chart',
		dance: 'dance',
		film: 'film',
		music: 'music',
		theatre: 'theatre',
		'visual-arts': 'palette',
		'theory-of-knowledge': 'question',
		'extended-essay': 'essay',
		'creativity-activity-service': 'heart'
	};

	const accents = ['#8b5cf6', '#0ea5e9', '#14b8a6', '#f97316', '#eab308', '#22c55e', '#ec4899'];

	$: icon = iconNames[subject] || 'book';
	$: accent =
		accents[
			Math.abs([...subject].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % accents.length
		];
</script>

<span
	class="subject-icon {size}"
	style={`--subject-accent: ${accent}`}
	data-subject={subject}
	aria-hidden="true"
>
	<svg
		viewBox="0 0 32 32"
		fill="none"
		stroke="currentColor"
		stroke-width="1.9"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		{#if icon === 'planet'}
			<circle cx="16" cy="16" r="6" /><path d="M5 19c3 3 11 2 17-1s8-7 5-9c-2-1-5 0-7 1" />
		{:else if icon === 'book'}
			<path
				d="M6 7h7a3 3 0 0 1 3 3v15a4 4 0 0 0-4-4H6zM26 7h-7a3 3 0 0 0-3 3v15a4 4 0 0 1 4-4h6z"
			/>
		{:else if icon === 'book-chat'}
			<path d="M5 7h8a3 3 0 0 1 3 3v14a4 4 0 0 0-4-4H5zM16 10a3 3 0 0 1 3-3h8v13h-7" /><path
				d="M20 12h4M20 16h3"
			/>
		{:else if icon === 'book-stage'}
			<path d="M5 8h8a3 3 0 0 1 3 3v13a4 4 0 0 0-4-4H5zM16 11a3 3 0 0 1 3-3h8v12h-7" /><path
				d="m23 3 1 2 2 .5-2 1-1 2-1-2-2-1 2-.5z"
			/>
		{:else if icon === 'column'}
			<path d="M7 8h18M9 5h14l2 3H7zM10 10v12M16 10v12M22 10v12M7 24h18M5 27h22" />
		{:else if icon === 'chat' || icon === 'spark-chat'}
			<path d="M6 7h20v14H14l-6 5v-5H6z" /><path d="M11 12h10M11 16h7" />
			{#if icon === 'spark-chat'}<path
					d="m24 3 .7 1.8L27 6l-2.3 1.2L24 9l-.8-1.8L21 6l2.2-1.2z"
				/>{/if}
		{:else if icon === 'frame'}
			<rect x="5" y="6" width="22" height="19" rx="2" /><circle cx="12" cy="12" r="2" /><path
				d="m8 22 6-6 4 4 3-3 4 5"
			/>
		{:else if icon === 'map'}
			<path d="m5 8 7-3 8 3 7-3v19l-7 3-8-3-7 3zM12 5v19M20 8v19" /><path d="m14 12 2-2 2 2-2 4z" />
		{:else if icon === 'briefcase'}
			<rect x="5" y="10" width="22" height="15" rx="2" /><path
				d="M12 10V7h8v3M5 16h22M14 16v3h4v-3"
			/>
		{:else if icon === 'trend'}
			<path d="M6 25V7M6 25h21M9 21l5-6 4 3 8-10M21 8h5v5" />
		{:else if icon === 'globe'}
			<circle cx="16" cy="16" r="11" /><path d="M5 16h22M16 5c4 4 4 18 0 22M16 5c-4 4-4 18 0 22" />
		{:else if icon === 'network' || icon === 'nodes'}
			<circle cx="16" cy="7" r="3" /><circle cx="8" cy="23" r="3" /><circle
				cx="24"
				cy="23"
				r="3"
			/><path d="m14.5 9.5-5 11M17.5 9.5l5 11M11 23h10" />
			{#if icon === 'nodes'}<circle cx="16" cy="17" r="2" />{/if}
		{:else if icon === 'history'}
			<path d="M7 9V4M4 7h6" /><path d="M8 12a10 10 0 1 1-1 8" /><path d="M16 10v7l5 3" />
		{:else if icon === 'bulb'}
			<path d="M11 22h10M12 25h8M16 4a8 8 0 0 0-5 14c1 1 1 2 1 2h8s0-1 1-2a8 8 0 0 0-5-14z" />
		{:else if icon === 'brain'}
			<path
				d="M16 8c-1-4-7-3-7 1-4 0-5 6-2 8-2 3 1 7 4 6 1 4 5 3 5 0zM16 8c1-4 7-3 7 1 4 0 5 6 2 8 2 3-1 7-4 6-1 4-5 3-5 0zM12 10c2 1 2 3 1 5M20 10c-2 1-2 3-1 5M10 18c2-1 4 0 4 2M22 18c-2-1-4 0-4 2"
			/>
		{:else if icon === 'people'}
			<circle cx="16" cy="10" r="4" /><circle cx="7" cy="13" r="3" /><circle
				cx="25"
				cy="13"
				r="3"
			/><path d="M9 27v-3a7 7 0 0 1 14 0v3M3 25v-2a5 5 0 0 1 5-5M29 25v-2a5 5 0 0 0-5-5" />
		{:else if icon === 'crescent'}
			<path d="M21 24A11 11 0 1 1 21 8a9 9 0 0 0 0 16z" /><path
				d="m23 11 .8 2 2.2.2-1.7 1.4.5 2.2-1.8-1.2-1.8 1.2.5-2.2-1.7-1.4 2.2-.2z"
			/>
		{:else if icon === 'compass'}
			<circle cx="16" cy="16" r="11" /><path d="m20 11-2 7-7 3 3-7z" /><circle
				cx="16"
				cy="16"
				r="1"
			/>
		{:else if icon === 'leaf' || icon === 'eco' || icon === 'atom-leaf'}
			<path d="M6 24c1-10 7-16 20-17-1 13-7 19-17 18" /><path d="M9 25c4-6 8-9 14-14" />
			{#if icon === 'eco'}<path d="M5 10c2-3 5-4 8-3M22 23c3 0 5-1 6-3" />{/if}
			{#if icon === 'atom-leaf'}<circle cx="9" cy="9" r="3" /><path d="M4 9h10M9 4v10" />{/if}
		{:else if icon === 'flask'}
			<path d="M12 5h8M14 5v7L7 24a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-12V5" /><path
				d="M10 21h12M12 18h8"
			/>
		{:else if icon === 'code'}
			<path d="m12 9-7 7 7 7M20 9l7 7-7 7M18 6l-4 20" />
		{:else if icon === 'ruler'}
			<path d="m8 25-3-3L21 6l5 5zM17 10l5 5M14 13l3 3M11 16l5 5" />
		{:else if icon === 'wave'}
			<path d="M4 13c5-5 9-5 14 0 3 3 6 3 10 0-1 10-8 15-15 13-6-2-9-7-9-13z" /><path
				d="M5 19c4 2 7 2 11-1 4-3 7-2 10 0"
			/>
		{:else if icon === 'atom'}
			<circle cx="16" cy="16" r="2" /><ellipse cx="16" cy="16" rx="12" ry="5" /><ellipse
				cx="16"
				cy="16"
				rx="5"
				ry="12"
				transform="rotate(35 16 16)"
			/><ellipse cx="16" cy="16" rx="5" ry="12" transform="rotate(-35 16 16)" />
		{:else if icon === 'pulse'}
			<path d="M4 16h6l2-6 4 13 3-9 2 2h7" /><path d="M7 8c4-4 7-2 9 1 2-3 5-5 9-1" />
		{:else if icon === 'function'}
			<path d="M6 25h21M8 27V5M10 21c5 0 5-13 10-13 2 0 4 1 6 3" /><path d="M13 8h6" />
		{:else if icon === 'chart'}
			<path d="M5 26h22M7 24V14h5v10M14 24V8h5v16M21 24V4h5v20" />
		{:else if icon === 'dance'}
			<circle cx="18" cy="6" r="3" /><path
				d="m17 10-4 7-6 2M14 15l7 3 4-4M13 17l2 5-4 5M18 19l4 7"
			/>
		{:else if icon === 'film'}
			<rect x="5" y="10" width="22" height="16" rx="2" /><path
				d="m6 10 4-6h6l-4 6M18 10l4-6h5l-4 6M5 16h22"
			/>
		{:else if icon === 'music'}
			<path d="M12 22V8l13-3v14M12 11l13-3" /><ellipse cx="8" cy="23" rx="4" ry="3" /><ellipse
				cx="21"
				cy="20"
				rx="4"
				ry="3"
			/>
		{:else if icon === 'theatre'}
			<path
				d="M5 7c5 2 9 2 13 0v8c0 6-3 9-6 10-4-1-7-4-7-10zM18 10c3 0 6-1 9-3v9c0 5-3 8-7 9-1 0-2-1-3-2"
			/><path d="M8 13h2M14 13h2M9 19c2 1 4 1 6 0M21 14h2M21 20c2-1 3-1 4 0" />
		{:else if icon === 'palette'}
			<path
				d="M16 5C9 5 4 10 4 16s5 11 11 11c3 0 3-3 2-4-1-2 1-4 3-3 4 2 8-1 8-5 0-6-5-10-12-10z"
			/><circle cx="10" cy="12" r="1" /><circle cx="15" cy="9" r="1" /><circle
				cx="21"
				cy="11"
				r="1"
			/><circle cx="9" cy="18" r="1" />
		{:else if icon === 'question'}
			<circle cx="16" cy="16" r="11" /><path d="M12 12a4 4 0 1 1 6 3c-2 1-2 2-2 4M16 23h.01" />
		{:else if icon === 'essay'}
			<path d="M7 4h13l5 5v19H7zM20 4v6h5M11 15h10M11 19h10M11 23h6" /><path d="m22 22 5-5" />
		{:else if icon === 'heart'}
			<path d="M16 26S5 20 5 12c0-6 8-8 11-2 3-6 11-4 11 2 0 8-11 14-11 14z" /><path
				d="M10 16h4l2-4 2 8 2-4h3"
			/>
		{/if}
	</svg>
</span>

<style>
	.subject-icon {
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 0.85rem;
		display: inline-grid;
		place-items: center;
		flex: 0 0 auto;
		color: var(--subject-accent);
		background: color-mix(in srgb, var(--subject-accent) 13%, var(--color-surface-variant));
		border: 1px solid color-mix(in srgb, var(--subject-accent) 30%, var(--color-border));
	}

	.subject-icon.small {
		width: 2.35rem;
		height: 2.35rem;
		border-radius: 0.72rem;
	}

	.subject-icon.large {
		width: 3.75rem;
		height: 3.75rem;
		border-radius: 1rem;
	}

	svg {
		width: 62%;
		height: 62%;
	}
</style>
