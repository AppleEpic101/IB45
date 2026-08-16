<script>
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import Dropdown from '$lib/components/dropdown.svelte';
	import { darkMode } from '$lib/stores/stores.js';

	export let name;
	export let level;
	export let language;
	export let grade;
	export let currentGrade;

	export let SLResults = [];
	export let HLResults = [];

	let isAE = name === 'Extended Essay' || name === 'Theory Of Knowledge';

	let number = 0;
	let userSelectedBoundary = false;
	const coreGradeNumber = { E: 1, D: 2, C: 3, B: 4, A: 5 };
	$: currentBoundaryNumber = isAE ? coreGradeNumber[currentGrade] : Number(currentGrade);
	$: if (
		!userSelectedBoundary &&
		Number.isInteger(currentBoundaryNumber) &&
		currentBoundaryNumber > 0 &&
		number !== currentBoundaryNumber
	) {
		number = currentBoundaryNumber;
	}
	$: dropdownLabels = isAE
		? [
				'All grades',
				...['A', 'B', 'C', 'D', 'E'].map((item) =>
					item === currentGrade ? `Grade ${item} · your grade` : `Grade ${item}`
				)
		  ]
		: [
				'All grades',
				...[7, 6, 5, 4, 3, 2, 1].map((item) =>
					item === Number(currentGrade) ? `Grade ${item} · your grade` : `Grade ${item}`
				)
		  ];
	$: selectedGradeLabel =
		number === 0
			? 'each grade'
			: isAE
			? `Grade ${['E', 'D', 'C', 'B', 'A'][number - 1]}`
			: `Grade ${number}`;

	$: results = level === 'HL' ? HLResults : SLResults;

	let chartCanvas;
	let scatterChart;
	let expanded = false;
	let isMobile = false;
	const setExpanded = async (value) => {
		expanded = value;
		await tick();
		scatterChart?.resize();
	};
	const closeOnEscape = (event) => {
		if (expanded && event.key === 'Escape') setExpanded(false);
	};

	// Vibrant color palette for 7 grades
	const borderColors = [
		'#ef4444', // 1: Red
		'#f97316', // 2: Orange
		'#eab308', // 3: Yellow
		'#22c55e', // 4: Green
		'#14b8a6', // 5: Teal
		'#3b82f6', // 6: Blue
		'#8b5cf6' // 7: Purple
	];

	// Slightly more vibrant fills
	const colors = borderColors.map((c) => c + '33'); // 0.2 opacity hex
	const sessionRank = (short) => {
		const match = /^([MN])(\d{2})/.exec(short ?? '');
		if (!match) return Number.MAX_SAFE_INTEGER;
		return Number(match[2]) * 2 + (match[1] === 'N' ? 1 : 0);
	};
	const summarizeSessions = (boundaryResults) => {
		const grouped = new Map();

		boundaryResults.forEach((result) => {
			if (!grouped.has(result.short)) {
				grouped.set(result.short, {
					short: result.short,
					name: result.name,
					results: []
				});
			}
			grouped.get(result.short).results.push(result);
		});

		return [...grouped.values()]
			.sort((a, b) => sessionRank(a.short) - sessionRank(b.short))
			.map((session) => ({
				...session,
				boundaries: Array.from({ length: isAE ? 5 : 7 }, (_, index) => {
					const values = session.results
						.map((result) => Number(result.tz[index]))
						.filter(Number.isFinite);
					if (!values.length) return { average: null, min: null, max: null };
					return {
						average: values.reduce((sum, value) => sum + value, 0) / values.length,
						min: Math.min(...values),
						max: Math.max(...values)
					};
				})
			}));
	};

	let showGraph = true;

	import { get } from 'svelte/store';

	function getStyle(variable) {
		if (typeof window === 'undefined') return '';

		// Priority fix: check store directly for theme variables to handle refresh correctly
		if (variable === '--color-text-main') {
			return get(darkMode) ? '#f8fafc' : '#0f172a';
		}
		if (variable === '--color-grid') {
			return get(darkMode) ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
		}

		return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
	}

	function createChart() {
		if (!chartCanvas) return;
		if (!results || results.length === 0) {
			showGraph = false;
			return;
		} else {
			showGraph = true;
		}

		const textColor = getStyle('--color-text-main') || '#0f172a';
		const gridColor = getStyle('--color-grid') || 'rgba(0, 0, 0, 0.1)';
		const sessionSummaries = summarizeSessions(results);
		const chartSessions = isMobile && !expanded ? sessionSummaries.slice(-8) : sessionSummaries;
		const labels = chartSessions.map((session) => session.short);

		const gradeBoundaries = Array.from({ length: isAE ? 5 : 7 }, (_, i) => ({
			label: isAE ? `Grade ${['E', 'D', 'C', 'B', 'A'][i]}` : `Grade ${i + 1}`,
			data: chartSessions.map((session) => session.boundaries[i].average),
			boundaryIndex: i,
			backgroundColor: colors[i],
			borderColor: borderColors[i],
			pointBackgroundColor: borderColors[i],
			pointBorderColor: '#fff',
			pointBorderWidth: 2,
			pointRadius: isMobile ? 5 : 6,
			pointHoverRadius: isMobile ? 7 : 8,
			pointHitRadius: isMobile ? 18 : 5,
			tension: isMobile ? 0.18 : 0,
			borderWidth: 3,
			fill: false
		}));

		const finalDatasets = number === 0 ? [...gradeBoundaries] : [gradeBoundaries[number - 1]];

		// Add a dataset for the user's current grade if it's valid AND we are in "All" view
		if (grade && grade > 0 && grade <= 100) {
			const gradeLineColor = getStyle('--color-primary') || '#3b82f6';
			finalDatasets.push({
				label: isAE ? 'Your score' : 'Your weighted score',
				data: chartSessions.map(() => grade),
				borderColor: gradeLineColor,
				borderWidth: 3,
				borderDash: [10, 5],
				pointRadius: 0,
				fill: false,
				tension: 0,
				order: -1 // Ensure it's on top
			});
		}

		if (scatterChart) {
			scatterChart.destroy();
		}

		scatterChart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				labels,
				datasets: finalDatasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: isMobile ? 'nearest' : 'point',
					axis: isMobile ? 'x' : undefined,
					intersect: !isMobile
				},
				scales: {
					x: {
						title: {
							display: true,
							text: 'Exam Session',
							color: textColor,
							font: {
								weight: 'bold',
								size: 14
							}
						},
						grid: {
							color: gridColor
						},
						ticks: {
							color: textColor,
							maxRotation: 0,
							autoSkip: true,
							maxTicksLimit: isMobile && !expanded ? 6 : expanded ? 18 : 12
						}
					},
					y: {
						title: {
							display: true,
							text: 'Minimum score (%)',
							color: textColor,
							font: {
								weight: 'bold',
								size: 14
							}
						},
						grid: {
							color: gridColor
						},
						ticks: {
							color: textColor,
							callback: function (value) {
								return value + '%';
							}
						}
					}
				},
				plugins: {
					legend: {
						display: true,
						position: 'top',
						labels: {
							color: textColor,
							usePointStyle: true,
							padding: 20,
							font: {
								size: 12
							}
						}
					},
					tooltip: {
						backgroundColor: 'rgba(30, 41, 59, 0.9)',
						titleColor: '#fff',
						bodyColor: '#fff',
						padding: 12,
						cornerRadius: 8,
						displayColors: true,
						callbacks: {
							title: function (context) {
								const session = chartSessions[context?.[0]?.dataIndex];
								if (!session) return '';
								const timezoneLabel =
									session.results.length > 1 ? ` · ${session.results.length} timezones` : '';
								return `${session.name}${timezoneLabel}`;
							},
							label: function (context) {
								if (
									context.dataset.label === 'Your score' ||
									context.dataset.label === 'Your weighted score'
								) {
									return `Your score: ${context.parsed.y}%`;
								}
								const session = chartSessions[context.dataIndex];
								const boundary = session?.boundaries[context.dataset.boundaryIndex];
								if (!boundary) return '';
								const range =
									boundary.min === boundary.max
										? ''
										: ` · timezones ${boundary.min}–${boundary.max}%`;
								return `${context.dataset.label}: ${boundary.average.toFixed(1)}%${range}`;
							}
						}
					}
				}
			}
		});
	}

	onMount(() => {
		const updateMobileView = () => {
			const nextMobile = window.innerWidth <= 600;
			isMobile = nextMobile;
			createChart();
		};

		updateMobileView();
		window.addEventListener('resize', updateMobileView);
		return () => {
			window.removeEventListener('resize', updateMobileView);
			scatterChart?.destroy();
		};
	});

	$: {
		if (language || number || results || level || grade !== undefined || $darkMode !== undefined) {
			createChart();
		}
	}
</script>

<svelte:window on:keydown={closeOnEscape} />

{#if showGraph}
	{#if expanded}
		<button
			type="button"
			class="modal-backdrop"
			aria-label="Close expanded historical boundaries graph"
			on:click={() => setExpanded(false)}
		/>
	{/if}
	<div
		class="chart-section"
		class:expanded
		role={expanded ? 'dialog' : undefined}
		aria-modal={expanded ? 'true' : undefined}
		aria-labelledby="historical-chart-title"
	>
		<button
			type="button"
			class="expand-button"
			aria-label={expanded ? 'Close expanded graph' : 'Expand graph'}
			title={expanded ? 'Close' : 'Expand graph'}
			on:click={() => setExpanded(!expanded)}
		>
			<span aria-hidden="true">{expanded ? '×' : '↗'}</span>
			<span>{expanded ? 'Close' : 'Expand'}</span>
		</button>
		<div class="header-container">
			<div class="title" id="historical-chart-title">
				<span>{isAE ? `${name}` : `${level} ${language || ''} ${name}`}</span>
				<p>Minimum score needed for {selectedGradeLabel} across past sessions.</p>
			</div>
			<div class="dropdown-container" on:change={() => (userSelectedBoundary = true)}>
				<Dropdown
					arr={dropdownLabels}
					arrVal={isAE ? [0, 5, 4, 3, 2, 1] : [0, 7, 6, 5, 4, 3, 2, 1]}
					bind:value={number}
				/>
			</div>
		</div>

		<div class="graph-wrapper">
			<div class="graph">
				<canvas bind:this={chartCanvas} />
			</div>
		</div>
		<details class="chart-help">
			<summary>How to read this chart</summary>
			<div>
				<p>
					Each point is the typical published boundary for that exam session. Hover or tap a point
					to see the timezone range.
				</p>
				<a href="/blog/understanding-your-ib-predict-results"
					>Read the plain-language results guide →</a
				>
			</div>
		</details>
	</div>
{/if}

<style lang="scss">
	.chart-section {
		position: relative;
		padding-top: 2px;
	}

	.chart-section.expanded {
		position: fixed;
		inset: 24px;
		z-index: 1001;
		display: flex;
		flex-direction: column;
		padding: 24px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		box-shadow: var(--shadow-lg);
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		border: 0;
		background: rgba(2, 6, 23, 0.74);
		cursor: zoom-out;
	}

	.expand-button {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 10px;
		border: 1px solid var(--color-border);
		border-radius: 9px;
		background: var(--color-surface-variant);
		color: var(--color-text-muted);
		font: inherit;
		font-size: 0.78rem;
		font-weight: 700;
		cursor: pointer;

		&:hover,
		&:focus-visible {
			border-color: var(--color-primary);
			color: var(--color-primary);
		}
	}

	.header-container {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 12px;
		gap: 1rem;
		padding-right: 104px;
	}

	.graph-wrapper {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: none;
		margin: 0;
	}

	.chart-help {
		margin-top: 10px;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);

		summary {
			padding-top: 9px;
			font-size: 0.76rem;
			font-weight: 700;
			cursor: pointer;
		}

		div {
			max-width: 680px;
			padding-top: 7px;
			font-size: 0.76rem;
			line-height: 1.45;
		}

		p {
			margin: 0;
		}

		a {
			display: inline-block;
			margin-top: 5px;
			color: var(--color-primary);
			font-weight: 700;
			text-decoration: none;
		}
	}

	.graph {
		height: 280px;
		position: relative;
	}

	.expanded .graph-wrapper,
	.expanded .graph {
		flex: 1;
		height: auto;
		min-height: 0;
	}

	@media screen and (max-width: 600px) {
		.header-container {
			align-items: flex-start;
			flex-direction: column;
			padding-right: 44px;
		}

		.graph {
			height: 260px;
		}
		.graph-wrapper {
			padding: 0.75rem 0.5rem 0.6rem;
		}
		.chart-section.expanded {
			inset: 10px;
			padding: 16px;
		}
		.expanded .graph-wrapper,
		.expanded .graph {
			height: auto;
		}
		.expand-button span:last-child {
			display: none;
		}
	}

	.title {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		font-size: 1rem;
		font-weight: 800;
		color: var(--color-text-main);
		text-align: left;
		line-height: 1.4;

		span {
			color: var(--color-text-main);
			font-size: 1.05rem;
		}

		p {
			margin: 2px 0 0;
			color: var(--color-text-muted);
			font-size: 0.75rem;
			font-weight: 500;
		}
	}

	.dropdown-container {
		display: flex;
		justify-content: flex-end;
	}
</style>
