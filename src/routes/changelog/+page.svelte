<script>
	import { fly } from 'svelte/transition';
	import PageHeader from '$lib/components/PageHeader.svelte';

	const filters = ['All', 'Data', 'Product', 'Design', 'Community'];
	const isoDate = (date) => new Date(`${date} 00:00:00 UTC`).toISOString().slice(0, 10);
	let activeFilter = 'All';

	const releases = [
		{
			date: 'August 14, 2026',
			month: 'AUG',
			year: '2026',
			category: 'Data',
			title: 'November 2024 and 2025 bulletin data',
			summary:
				'Two November sessions of worldwide results are now available throughout IB Predict.',
			items: [
				'Added final November 2024 and November 2025 results for 102 subject and level combinations each.',
				'Added May 2025 candidate totals, mean grades, and grade distributions for 160 subjects.',
				'Expanded the exam-session switcher so students can compare November and May sessions.',
				'Marked the May 2025 figures as provisional to match the source bulletin.',
				'Redesigned the assistant as a modern AI workspace with image uploads, tool activity, and automatic subject-mark entry.'
			],
			latest: true
		},
		{
			date: 'July 14, 2026',
			month: 'JUL',
			year: '2026',
			category: 'Product',
			title: 'Dedicated grade-boundary pages',
			summary: 'Historical boundaries became easier to browse outside the calculator.',
			items: [
				'Launched dedicated grade-boundary index and subject pages.',
				'Updated the sitemap, team roles, and About page content.',
				'Improved deployment stability for Cloudflare.'
			]
		},
		{
			date: 'May 14, 2026',
			month: 'MAY',
			year: '2026',
			category: 'Product',
			title: 'Science calculator corrections',
			summary: 'Assessment structures were aligned with the latest science specifications.',
			items: [
				'Corrected Biology, Chemistry, and Physics assessment weights.',
				'Fixed Physics Paper 1b maximum marks and SL Paper 1a data.',
				'Reviewed Biology assessment data for the current syllabus.'
			]
		},
		{
			date: 'February 12, 2026',
			month: 'FEB',
			year: '2026',
			category: 'Design',
			title: 'Major interface refresh',
			summary: 'The calculator and data visualizations received a full visual overhaul.',
			items: [
				'Introduced a cleaner, responsive interface across desktop and mobile.',
				'Added November 2025 grade boundaries.',
				'Improved grade graphs with averages, standard deviations, and clearer labeling.',
				'Corrected timezone selection and core-subject percentages.'
			]
		},
		{
			date: 'October 4, 2025',
			month: 'OCT',
			year: '2025',
			category: 'Data',
			title: 'May 2025 grade boundaries',
			summary: 'The newest examination boundaries became available in subject calculators.',
			items: [
				'Added May 2025 boundaries across supported subjects and timezones.',
				'Fixed timezone mapping for the new examination session.'
			]
		},
		{
			date: 'August 13, 2025',
			month: 'AUG',
			year: '2025',
			category: 'Design',
			title: 'Consistent subject browsing',
			summary: 'Subject discovery and calculator controls were standardized.',
			items: [
				'Made buttons and interactive states consistent across the subject directory.',
				'Polished the home-page calculator and segmented grade indicator.'
			]
		},
		{
			date: 'July 16, 2025',
			month: 'JUL',
			year: '2025',
			category: 'Product',
			title: 'Richer subject insights',
			summary: 'Subject pages gained more context, visual data, and mobile support.',
			items: [
				'Added the global grade-distribution graph and bulletin table.',
				'Redesigned subject pages and improved mobile layouts.',
				'Added the segmented grade display, colored core matrix, and About page.',
				'Improved historical tables and filled missing grade boundaries.'
			]
		},
		{
			date: 'June 11, 2025',
			month: 'JUN',
			year: '2025',
			category: 'Design',
			title: 'Visual system and bulletin beta',
			summary: 'IB Predict adopted a more cohesive visual language.',
			items: [
				'Introduced the statistical bulletin beta and descriptive page headers.',
				'Refreshed colors, fonts, banners, and typography rendering.',
				'Fixed the core matrix calculation.'
			]
		},
		{
			date: 'May 11, 2025',
			month: 'MAY',
			year: '2025',
			category: 'Community',
			title: 'Community access improvements',
			summary: 'Support and guidance became easier to find around the site.',
			items: [
				'Added the Discord community widget and refreshed social icons.',
				'Expanded FAQs, footnotes, and calculator guidance.'
			]
		},
		{
			date: 'April 22, 2025',
			month: 'APR',
			year: '2025',
			category: 'Data',
			title: 'Philosophy 2025 syllabus',
			summary: 'Philosophy was updated for the new assessment cycle.',
			items: [
				'Added the 2025 Philosophy course structure.',
				'Clarified calculator footnotes and mark requirements.'
			]
		},
		{
			date: 'March 15, 2025',
			month: 'MAR',
			year: '2025',
			category: 'Data',
			title: 'November 2024 boundaries',
			summary: 'Another examination session was added to historical comparisons.',
			items: [
				'Added November 2024 grade boundaries.',
				'Fixed SL-only handling and floating-point grade calculations.'
			]
		},
		{
			date: 'February 7, 2025',
			month: 'FEB',
			year: '2025',
			category: 'Product',
			title: '2025 course updates',
			summary: 'Calculators were prepared for the incoming examination specifications.',
			items: [
				'Updated course structures for the May 2025 session.',
				'Improved saved calculator-state behavior and corrected Psychology data.'
			]
		},
		{
			date: 'October 23, 2024',
			month: 'OCT',
			year: '2024',
			category: 'Data',
			title: 'May 2024 data and 2025 sciences',
			summary: 'Historical coverage grew while the next science cycle was prepared.',
			items: [
				'Added May 2024 grade boundaries.',
				'Added the 2025 Biology, Chemistry, and Physics syllabuses.',
				'Introduced the educator Excel tool.'
			],
			links: [
				{ label: 'Biology (2025)', href: '/subjects/biology?syl=2025' },
				{ label: 'Chemistry (2025)', href: '/subjects/chemistry?syl=2025' },
				{ label: 'Physics (2025)', href: '/subjects/physics?syl=2025' }
			]
		},
		{
			date: 'May 14, 2024',
			month: 'MAY',
			year: '2024',
			category: 'Product',
			title: 'Flexible boundary selection',
			summary: 'Students gained more control over the session used by each calculator.',
			items: [
				'Added individual grade-boundary selection.',
				'Added November 2023 boundaries and historical subject graphs.',
				'Archived superseded 2024 course specifications.'
			]
		},
		{
			date: 'April 9, 2024',
			month: 'APR',
			year: '2024',
			category: 'Community',
			title: 'IB Predict community',
			summary: 'A dedicated space opened for support and post-exam discussion.',
			items: [
				'Launched the IB Predict Discord community.',
				'Expanded support options beyond email.'
			],
			links: [{ label: 'Join Discord', href: 'https://discord.gg/G8UvbTJHp8' }]
		},
		{
			date: 'January 2, 2024',
			month: 'JAN',
			year: '2024',
			category: 'Design',
			title: 'Home-page navigation refresh',
			summary: 'The landing page became faster to scan and easier to navigate.',
			items: [
				'Added prominent navigation cards and buttons.',
				'Improved domain and deployment reliability.'
			]
		},
		{
			date: 'November 17, 2023',
			month: 'NOV',
			year: '2023',
			category: 'Data',
			title: 'May 2024 syllabus preparation',
			summary: 'Five subjects were readied for their upcoming specification changes.',
			items: [
				'Updated Business Management, Classical Language, Digital Society, Literature and Performance, and Theatre.'
			]
		},
		{
			date: 'September 25, 2023',
			month: 'SEP',
			year: '2023',
			category: 'Data',
			title: 'May 2023 boundaries',
			summary: 'Historical comparison and subject coverage expanded.',
			items: [
				'Added May 2023 boundaries.',
				'Added Marine Science and probability-distribution graphs.'
			]
		},
		{
			date: 'August 22, 2023',
			month: 'AUG',
			year: '2023',
			category: 'Design',
			title: 'The first full interface',
			summary: 'The foundational IB Predict experience came together.',
			items: [
				'Added dark mode, subject browsing, and individual subject pages.',
				'Added timezone selection, historical tables, and the changelog.',
				'Expanded coverage with May 2021, November 2019, and November 2020 boundaries.'
			]
		},
		{
			date: 'June 8, 2023',
			month: 'JUN',
			year: '2023',
			category: 'Product',
			title: 'Initial release',
			summary: 'IB Predict launched with its first calculators and datasets.',
			items: [
				'Released the first version of IB Predict.',
				'Added May 2019 boundaries and bilingual diploma support.'
			]
		}
	];

	$: visibleReleases =
		activeFilter === 'All'
			? releases
			: releases.filter((release) => release.category === activeFilter);
</script>

<PageHeader
	title="IB Predict Changelog"
	description="Explore IB Predict releases, new examination data, calculator improvements, and interface updates."
/>

<main class="changelog-page">
	<section class="hero" in:fly={{ duration: 700, y: 24 }}>
		<div class="hero-copy">
			<div class="eyebrow"><span class="pulse" /> Product updates</div>
			<h1>What’s new in <span>IB Predict</span></h1>
			<p>
				Follow new examination data, calculator improvements, and interface updates from the first
				release through today.
			</p>
		</div>
		<div class="release-summary" aria-label="Latest release summary">
			<div class="summary-icon" aria-hidden="true">↗</div>
			<div>
				<span>Latest release</span><strong>November bulletins</strong><small
					>Updated August 14, 2026</small
				>
			</div>
		</div>
	</section>

	<section class="toolbar" aria-label="Filter changelog">
		<div class="filter-copy">
			<strong>Release history</strong><span
				>{visibleReleases.length} {visibleReleases.length === 1 ? 'update' : 'updates'}</span
			>
		</div>
		<div class="filters">
			{#each filters as filter}
				<button
					type="button"
					class:active={activeFilter === filter}
					aria-pressed={activeFilter === filter}
					on:click={() => (activeFilter = filter)}>{filter}</button
				>
			{/each}
		</div>
	</section>

	<section class="timeline" aria-live="polite">
		{#each visibleReleases as release, index (release.date)}
			<article
				class="release-card"
				class:latest={release.latest}
				in:fly={{ duration: 450, y: 18, delay: Math.min(index * 45, 270) }}
			>
				<div class="date-column">
					<div class="date-badge"><strong>{release.month}</strong><span>{release.year}</span></div>
					<div class="timeline-line" aria-hidden="true" />
				</div>
				<div class="card-content">
					<div class="card-meta">
						<span class="category" data-category={release.category}>{release.category}</span>
						<time datetime={isoDate(release.date)}>{release.date}</time>
						{#if release.latest}<span class="latest-label">Latest</span>{/if}
					</div>
					<h2>{release.title}</h2>
					<p>{release.summary}</p>
					<ul>
						{#each release.items as item}<li>{item}</li>{/each}
					</ul>
					{#if release.links}
						<div class="release-links">
							{#each release.links as link}<a href={link.href}
									>{link.label}<span aria-hidden="true">→</span></a
								>{/each}
						</div>
					{/if}
				</div>
			</article>
		{/each}
	</section>
</main>

<style>
	.changelog-page {
		width: min(1080px, calc(100% - 32px));
		margin: 0 auto;
		padding: 56px 0 88px;
	}
	.hero {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.7fr);
		gap: 40px;
		align-items: end;
		padding: 48px;
		overflow: hidden;
		border: 1px solid var(--color-border);
		border-radius: 28px;
		background: radial-gradient(
				circle at 90% 10%,
				color-mix(in srgb, var(--color-primary) 24%, transparent),
				transparent 34%
			),
			linear-gradient(145deg, var(--color-surface), var(--color-surface-variant));
		box-shadow: var(--shadow-lg);
	}
	.hero::after {
		content: '';
		position: absolute;
		width: 240px;
		height: 240px;
		right: -110px;
		bottom: -130px;
		border: 44px solid color-mix(in srgb, var(--color-primary) 12%, transparent);
		border-radius: 50%;
		pointer-events: none;
	}
	.hero-copy,
	.release-summary {
		position: relative;
		z-index: 1;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 18px;
		color: var(--color-primary-dark);
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.pulse {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--color-primary);
		box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-primary) 18%, transparent);
	}
	h1 {
		max-width: 680px;
		margin: 0;
		color: var(--color-text-main);
		font-size: clamp(2.5rem, 7vw, 4.75rem);
		font-weight: 900;
		letter-spacing: -0.055em;
		line-height: 0.98;
	}
	h1 span {
		color: var(--color-primary-dark);
	}
	.hero-copy > p {
		max-width: 660px;
		margin: 24px 0 0;
		color: var(--color-text-muted);
		font-size: 1.05rem;
		line-height: 1.75;
	}
	.release-summary {
		display: flex;
		gap: 16px;
		align-items: center;
		padding: 20px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 26%, var(--color-border));
		border-radius: 18px;
		background: color-mix(in srgb, var(--color-surface) 86%, transparent);
		backdrop-filter: blur(12px);
		box-shadow: var(--shadow-md);
	}
	.summary-icon {
		display: grid;
		flex: 0 0 auto;
		place-items: center;
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: var(--color-primary);
		color: white;
		font-size: 1.3rem;
		font-weight: 900;
	}
	.release-summary div:last-child {
		display: grid;
		gap: 3px;
	}
	.release-summary span,
	.release-summary small {
		color: var(--color-text-muted);
		font-size: 0.75rem;
	}
	.release-summary strong {
		color: var(--color-text-main);
		font-size: 0.98rem;
	}
	.toolbar {
		display: flex;
		gap: 24px;
		align-items: center;
		justify-content: space-between;
		margin: 48px 0 30px;
	}
	.filter-copy {
		display: grid;
		gap: 3px;
	}
	.filter-copy strong {
		color: var(--color-text-main);
		font-size: 1.25rem;
	}
	.filter-copy span {
		color: var(--color-text-muted);
		font-size: 0.82rem;
	}
	.filters {
		display: flex;
		gap: 6px;
		padding: 5px;
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: var(--color-surface);
		box-shadow: var(--shadow-sm);
	}
	.filters button {
		border: 0;
		border-radius: 999px;
		padding: 9px 15px;
		background: transparent;
		color: var(--color-text-muted);
		font: inherit;
		font-size: 0.82rem;
		font-weight: 750;
		white-space: nowrap;
		cursor: pointer;
		transition: 0.2s ease;
	}
	.filters button:hover,
	.filters button:focus-visible {
		color: var(--color-text-main);
	}
	.filters button:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 2px;
	}
	.filters button.active {
		background: var(--color-primary);
		color: white;
		box-shadow: 0 6px 16px color-mix(in srgb, var(--color-primary) 28%, transparent);
	}
	.timeline {
		display: grid;
	}
	.release-card {
		display: grid;
		grid-template-columns: 86px minmax(0, 1fr);
		gap: 24px;
	}
	.date-column {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.date-badge {
		display: grid;
		flex: 0 0 auto;
		place-items: center;
		width: 66px;
		height: 66px;
		border: 1px solid var(--color-border);
		border-radius: 18px;
		background: var(--color-surface);
		box-shadow: var(--shadow-sm);
	}
	.date-badge strong {
		color: var(--color-primary-dark);
		font-size: 0.82rem;
		letter-spacing: 0.08em;
	}
	.date-badge span {
		color: var(--color-text-muted);
		font-size: 0.68rem;
	}
	.timeline-line {
		width: 2px;
		min-height: 50px;
		flex: 1;
		margin: 8px 0;
		background: linear-gradient(var(--color-border), transparent);
	}
	.release-card:last-child .timeline-line {
		display: none;
	}
	.card-content {
		margin-bottom: 26px;
		padding: 28px 30px;
		border: 1px solid var(--color-border);
		border-radius: 22px;
		background: var(--color-surface);
		box-shadow: var(--shadow-sm);
		transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
	}
	.card-content:hover {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
		box-shadow: var(--shadow-md);
	}
	.release-card.latest .card-content {
		border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
		box-shadow: 0 16px 42px color-mix(in srgb, var(--color-primary) 10%, transparent);
	}
	.card-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
		margin-bottom: 13px;
	}
	.category,
	.latest-label {
		border-radius: 999px;
		padding: 5px 9px;
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	.category {
		background: var(--color-surface-variant);
		color: var(--color-primary-dark);
	}
	.category[data-category='Data'] {
		background: color-mix(in srgb, #8b5cf6 14%, var(--color-surface));
		color: #7c3aed;
	}
	.category[data-category='Product'] {
		background: color-mix(in srgb, #10b981 14%, var(--color-surface));
		color: #059669;
	}
	.category[data-category='Community'] {
		background: color-mix(in srgb, #f59e0b 16%, var(--color-surface));
		color: #d97706;
	}
	.latest-label {
		background: var(--color-primary);
		color: white;
	}
	time {
		color: var(--color-text-muted);
		font-size: 0.76rem;
		font-weight: 650;
	}
	.card-content h2 {
		margin: 0;
		color: var(--color-text-main);
		font-size: clamp(1.35rem, 3vw, 1.75rem);
		letter-spacing: -0.025em;
	}
	.card-content > p {
		max-width: 760px;
		margin: 9px 0 20px;
		color: var(--color-text-muted);
		line-height: 1.65;
	}
	.card-content ul {
		display: grid;
		gap: 9px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.card-content li {
		position: relative;
		padding-left: 21px;
		color: var(--color-text-main);
		font-size: 0.92rem;
		line-height: 1.55;
	}
	.card-content li::before {
		content: '';
		position: absolute;
		top: 0.58em;
		left: 2px;
		width: 7px;
		height: 7px;
		border: 2px solid var(--color-primary);
		border-radius: 50%;
	}
	.release-links {
		display: flex;
		flex-wrap: wrap;
		gap: 9px;
		margin-top: 22px;
	}
	.release-links a {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		padding: 8px 11px;
		background: var(--color-surface-variant);
		color: var(--color-primary-dark);
		font-size: 0.78rem;
		font-weight: 750;
		text-decoration: none;
		transition: 0.2s ease;
	}
	.release-links a:hover,
	.release-links a:focus-visible {
		border-color: var(--color-primary);
		transform: translateY(-1px);
	}
	@media (max-width: 780px) {
		.changelog-page {
			padding-top: 28px;
		}
		.hero {
			grid-template-columns: 1fr;
			padding: 34px 28px;
		}
		.toolbar {
			align-items: flex-start;
			flex-direction: column;
		}
		.filters {
			width: calc(100% - 10px);
		}
	}
	@media (max-width: 540px) {
		.changelog-page {
			width: min(100% - 20px, 1080px);
			padding-bottom: 52px;
		}
		.hero {
			border-radius: 22px;
			padding: 30px 22px;
		}
		.hero-copy > p {
			font-size: 0.95rem;
		}
		.release-card {
			grid-template-columns: 48px minmax(0, 1fr);
			gap: 10px;
		}
		.date-badge {
			width: 46px;
			height: 52px;
			border-radius: 13px;
		}
		.date-badge strong {
			font-size: 0.68rem;
		}
		.date-badge span {
			font-size: 0.58rem;
		}
		.card-content {
			padding: 22px 20px;
			border-radius: 18px;
		}
		.card-meta {
			align-items: flex-start;
			flex-direction: column;
		}
		.release-summary {
			padding: 16px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card-content,
		.filters button,
		.release-links a {
			transition: none;
		}
	}
</style>
