<script>
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
				'Fixed missing-boundary selections so the next-grade field says unavailable instead of incorrectly implying the top grade.',
				'Replaced “markband” and “candidate” jargon in result tables with clearer grade-boundary and student labels.',
				'Relabeled predicted-mark results as weighted score and marks to the named next grade, removing ambiguous “Grade” and “Points Away” labels.',
				'Added a plain-language FAQ for experimental forecasts, separating boundary uncertainty from exam-performance predictions.',
				'Moved the full TOK and Extended Essay core-points matrix behind an optional explanation and kept dedicated boundary pages focused on boundaries.',
				'Condensed the diploma sidebar to total points and diploma status, with subject and core grades available in an optional breakdown.',
				'Removed the duplicate forecast card from subject pages and placed the chart and model checks behind the forecast summary’s optional details.',
				'Removed false decimal precision from student comparisons and labeled every ranking as approximate.',
				'Aligned the calculator, FAQ, assistant, and results guide around plain-language grade outlooks while keeping technical statistics optional.',
				'Prevented saved assessment marks from exceeding a newly selected component’s maximum and producing impossible scores.',
				'Focused historical charts on the student’s current predicted-grade boundary by default, with all-grade comparison optional and simpler minimum-score wording.',
				'Reduced grade strategy to one recommended action and one plain-language outlook, with assessment calculations and historical comparisons in a single optional section.',
				'Removed the inferred bell curve from grade distributions, surfaced the student result and session average, and placed chart guidance behind one optional explanation.',
				'Made collapsed subject cards keep only the weighted score and predicted grade while hiding boundaries, insights, assessment controls, and analysis links.',
				'Reframed forecast likelihoods around a fixed student score, hid model diagnostics behind an optional section, and made assistant trend answers less speculative.',
				'Moved session, timezone, syllabus, and pandemic-era reference notes behind one optional disclosure and added a dedicated selection guide.',
				'Simplified forecast and distribution language, removed repeated chart descriptions, and moved student-count caveats behind an optional explanation.',
				'Simplified statistical summaries, hid advanced boundary statistics by default, and added a plain-language results guide.',
				'Condensed collapsed subject cards to the subject name, weighted score, and awarded grade.',
				'Eliminated the Extended Essay refresh flash by aligning server-rendered and hydrated calculator state.',
				'Added hover and keyboard tooltips for truncated assessment names in the main calculator.',
				'Aligned EE and TOK grade distributions with the graph and always-visible table used by standard subject pages.',
				'Added official Extended Essay subject-group and TOK grade comparisons for six examination sessions.',
				'Refined the Extended Essay calculator and rebuilt its boundary history and core-points matrix for desktop and mobile.',
				'Added session-level diploma benchmarks and an estimated overall-score percentile to the main calculator.',
				'Added grade strategy tools with next-grade recommendations, assessment impact, historical confidence, and session-by-session what-if results.',
				'Brought compact next-grade strategy, confidence, percentile, assessment impact, and historical what-if insights into the main calculator.',
				'Added final May 2023 results for 164 subject and level combinations and November 2023 results for 100.',
				'Added final November 2024 and November 2025 results for 102 subject and level combinations each.',
				'Added May 2025 candidate totals, mean grades, and grade distributions for 160 subjects.',
				'Expanded the exam-session switcher so students can compare November and May sessions.',
				'Marked the May 2025 figures as provisional to match the source bulletin.',
				'Redesigned the assistant as a modern AI workspace with image uploads, tool activity, and automatic subject-mark entry.',
				'Added inline subject boundaries, grade margins, and a compact diploma summary to the main calculator.',
				'Introduced experimental November 2026 boundary forecasts with prediction intervals, rolling backtests, and personalized grade probabilities.'
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
	<header class="intro">
		<p class="eyebrow">Changelog</p>
		<h1>Product updates</h1>
		<p class="intro-copy">
			New examination data, calculator improvements, and changes to IB Predict.
		</p>
		<p class="latest-release"><strong>Latest:</strong> November bulletins · August 14, 2026</p>
	</header>

	<section class="toolbar" aria-label="Filter changelog">
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
		<span class="result-count"
			>{visibleReleases.length} {visibleReleases.length === 1 ? 'update' : 'updates'}</span
		>
	</section>

	<section class="timeline" aria-live="polite">
		{#each visibleReleases as release (release.date)}
			<article class="release-card">
				<div class="date-column">
					<time datetime={isoDate(release.date)}>{release.date}</time>
				</div>
				<div class="card-content">
					<div class="card-meta">
						<span class="category" data-category={release.category}>{release.category}</span>
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
		width: min(900px, calc(100% - 40px));
		margin: 0 auto;
		padding: 72px 0 96px;
	}
	.intro {
		max-width: 680px;
		padding-bottom: 48px;
	}
	.eyebrow {
		margin: 0 0 14px;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	h1 {
		margin: 0;
		color: var(--color-text-main);
		font-size: clamp(2.25rem, 6vw, 3.4rem);
		font-weight: 750;
		letter-spacing: -0.045em;
		line-height: 1.05;
	}
	.intro-copy {
		margin: 18px 0 0;
		color: var(--color-text-muted);
		font-size: 1rem;
		line-height: 1.65;
	}
	.latest-release {
		margin: 20px 0 0;
		color: var(--color-text-muted);
		font-size: 0.78rem;
	}
	.latest-release strong {
		color: var(--color-text-main);
		font-weight: 650;
	}
	.toolbar {
		display: flex;
		gap: 20px;
		align-items: center;
		justify-content: space-between;
		border-top: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		padding: 14px 0;
	}
	.filters {
		display: flex;
		gap: 22px;
		overflow-x: auto;
	}
	.filters button {
		border: 0;
		border-radius: 0;
		padding: 3px 0;
		background: transparent;
		color: var(--color-text-muted);
		font: inherit;
		font-size: 0.8rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		transition: color 0.15s ease;
	}
	.filters button:hover,
	.filters button:focus-visible {
		color: var(--color-text-main);
	}
	.filters button:focus-visible {
		outline: 1px solid var(--color-primary);
		outline-offset: 4px;
	}
	.filters button.active {
		color: var(--color-text-main);
		text-decoration: underline;
		text-decoration-color: var(--color-primary);
		text-decoration-thickness: 2px;
		text-underline-offset: 6px;
	}
	.result-count {
		color: var(--color-text-muted);
		font-size: 0.75rem;
		white-space: nowrap;
	}
	.timeline {
		display: grid;
	}
	.release-card {
		display: grid;
		grid-template-columns: 150px minmax(0, 1fr);
		gap: 32px;
		border-bottom: 1px solid var(--color-border);
		padding: 44px 0;
	}
	.release-card:last-child {
		border-bottom: 0;
	}
	.date-column {
		padding-top: 2px;
	}
	.date-column time {
		color: var(--color-text-muted);
		font-size: 0.78rem;
		line-height: 1.5;
	}
	.card-content {
		min-width: 0;
	}
	.card-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
		margin-bottom: 10px;
	}
	.category,
	.latest-label {
		padding: 0;
		background: transparent;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}
	.category {
		color: var(--color-text-muted);
	}
	.latest-label {
		color: var(--color-primary-dark);
	}
	.card-content h2 {
		margin: 0;
		color: var(--color-text-main);
		font-size: clamp(1.25rem, 3vw, 1.55rem);
		font-weight: 700;
		letter-spacing: -0.02em;
	}
	.card-content > p {
		max-width: 760px;
		margin: 8px 0 18px;
		color: var(--color-text-muted);
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.card-content ul {
		display: grid;
		gap: 7px;
		margin: 0;
		padding-left: 18px;
	}
	.card-content li {
		color: var(--color-text-main);
		font-size: 0.86rem;
		line-height: 1.55;
	}
	.card-content li::marker {
		color: var(--color-text-muted);
	}
	.release-links {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-top: 18px;
	}
	.release-links a {
		display: inline-flex;
		gap: 6px;
		align-items: center;
		padding: 0;
		color: var(--color-primary-dark);
		font-size: 0.76rem;
		font-weight: 650;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.release-links a:hover,
	.release-links a:focus-visible {
		color: var(--color-text-main);
	}
	@media (max-width: 780px) {
		.changelog-page {
			padding-top: 48px;
		}
		.toolbar {
			gap: 14px;
		}
	}
	@media (max-width: 540px) {
		.changelog-page {
			width: min(100% - 32px, 900px);
			padding-bottom: 52px;
		}
		.intro {
			padding-bottom: 36px;
		}
		.toolbar {
			align-items: flex-start;
			flex-direction: column;
		}
		.filters {
			width: 100%;
		}
		.release-card {
			grid-template-columns: 1fr;
			gap: 12px;
			padding: 32px 0;
		}
		.date-column {
			padding: 0;
		}
		.date-column time {
			font-size: 0.72rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.filters button {
			transition: none;
		}
	}
</style>
