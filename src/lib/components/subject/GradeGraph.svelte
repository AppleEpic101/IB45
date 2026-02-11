<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import Dropdown from '$lib/components/dropdown.svelte';
	import { darkMode } from '$lib/stores/stores.js';

	export let name;
	export let level;
	export let language;
	export let grade;

	export let SLResults = [];
	export let HLResults = [];

	let isAE = name === 'Extended Essay' || name === 'Theory Of Knowledge';

	// Default to 'All' which will be 0
	let number = 0;

	$: results = level === 'HL' ? HLResults : SLResults;

	let chartCanvas;
	let scatterChart;

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
		if (!results || results.length === 0) {
			showGraph = false;
			return;
		} else {
			showGraph = true;
		}

		const textColor = getStyle('--color-text-main') || '#0f172a';
		const mutedColor = getStyle('--color-text-muted') || '#475569';
		const gridColor = getStyle('--color-grid') || 'rgba(0, 0, 0, 0.1)';

		const gradeBoundaries = Array.from({ length: isAE ? 5 : 7 }, (_, i) => ({
			label: isAE ? ['E', 'D', 'C', 'B', 'A'][i] : `Grade ${i + 1}`,
			data: results
				.map((result) => {
					const parts = result.name.split(' ');
					let year = parseInt(parts[1]);
					if (parts[0] === 'November') {
						year += 0.5;
					}
					return {
						x: year,
						y: result.tz[i],
						fullName: result.fullName
					};
				})
				.sort((a, b) => a.x - b.x), // Ensure data is sorted by year
			backgroundColor: colors[i],
			borderColor: borderColors[i],
			pointBackgroundColor: borderColors[i],
			pointBorderColor: '#fff',
			pointBorderWidth: 2,
			pointRadius: 6,
			pointHoverRadius: 8,
			pointHitRadius: 5, // Exact target
			tension: 0.4, // Smooth lines
			borderWidth: 3,
			fill: false,
			hidden: i < 3 && number === 0 // Hide grades 1-3 by default in 'All' view
		}));

		// If number is 0, show all. Otherwise filter to selected.
		const datasetsToShow =
			number === 0 ? gradeBoundaries : [gradeBoundaries[isAE ? 5 - number : number - 1]]; // Dropdown logic for AE might need adjustment if it maps 1-5 to A-E

		// Correct AE mapping: A is 5, E is 1?
		// if number is 5, we want A (index 4)
		// if number is 1, we want E (index 0)
		// So index = number - 1

		const finalDatasets = number === 0 ? [...gradeBoundaries] : [gradeBoundaries[number - 1]];

		// Add a dataset for the user's current grade if it's valid AND we are in "All" view
		if (grade && grade > 0 && grade <= 100 && number === 0) {
			const gradeLineColor = getStyle('--color-primary') || '#3b82f6';
			finalDatasets.push({
				label: 'Your Current Score',
				data: results
					.map((r) => {
						const parts = r.name.split(' ');
						let year = parseInt(parts[1]);
						if (parts[0] === 'November') year += 0.5;
						return { x: year, y: grade };
					})
					.sort((a, b) => a.x - b.x),
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
				datasets: finalDatasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					mode: 'point',
					intersect: true
				},
				scales: {
					x: {
						type: 'linear',
						position: 'bottom',
						title: {
							display: true,
							text: 'Examination Year',
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
							callback: function (value) {
								if (Number.isInteger(value)) {
									return value.toString().replace(/,/g, ''); // Remove commas from years
								}
								return '';
							}
						}
					},
					y: {
						title: {
							display: true,
							text: 'Grade Boundary (%)',
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
								if (context && context.length > 0) {
									// In Chart.js v3+, context is an array of tooltip items
									return context[0].raw.fullName || '';
								}
								return '';
							},
							label: function (context) {
								if (context.dataset.label === 'Your Current Score') {
									return `Your Score: ${context.raw.y}%`;
								}
								const label = context.dataset.label || '';
								return `${label}: ${context.raw.y}%`;
							}
						}
					}
				}
			}
		});
	}

	onMount(() => {
		createChart();
	});

	$: {
		if (language || number || results || level || grade !== undefined || $darkMode !== undefined) {
			createChart();
		}
	}
</script>

{#if showGraph}
	<div class="header-container">
		<div class="title">
			Historical Grade Boundaries for<br />
			<span>{isAE ? `${name}` : `${level} ${language || ''} ${name}`}</span>
		</div>
		<div class="dropdown-container">
			<Dropdown
				arr={isAE
					? ['All Boundaries', 'A', 'B', 'C', 'D', 'E']
					: ['All Boundaries', 7, 6, 5, 4, 3, 2, 1]}
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
{/if}

<style lang="scss">
	.header-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
		gap: 1rem;
	}

	.graph-wrapper {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow-md);
		margin: 1rem 0;
	}

	.graph {
		height: 50vh;
		position: relative;
	}

	@media screen and (max-width: 600px) {
		.graph {
			height: 40vh;
		}
		.graph-wrapper {
			padding: 1rem;
		}
	}

	.title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-main);
		text-align: center;
		line-height: 1.4;

		span {
			color: var(--color-primary);
			font-weight: 800;
			font-size: 1.5rem;
		}
	}

	.dropdown-container {
		display: flex;
		justify-content: center;
		width: 100%;
		max-width: 250px;
	}
</style>
