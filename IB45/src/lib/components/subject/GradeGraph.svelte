<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import Dropdown from '$lib/components/dropdown.svelte';

	export let name;
	export let level;
	export let language;
	export let grade;

	export let SLResults = [];
	export let HLResults = [];

	let isAE = name === 'Extended Essay' || name === 'Theory Of Knowledge';
	let number = isAE ? 5 : 7;

	$: results = level === 'HL' ? HLResults : SLResults;

	let chartCanvas;
	let scatterChart;

	const colors = [
		'rgba(255, 99, 132, 0.3)',
		'rgba(255, 159, 64, 0.3)',
		'rgba(255, 205, 86, 0.3)',
		'rgba(75, 192, 192, 0.3)',
		'rgba(138, 218, 234, 0.3)',
		'rgba(54, 162, 235, 0.3)',
		'rgba(153, 102, 255, 0.3)'
	];

	const borderColors = [
		'rgba(255, 99, 132, 1)',
		'rgba(255, 159, 64, 1)',
		'rgba(255, 205, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(138, 218, 234, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(153, 102, 255, 1)'
	];

	let showGraph = true;

	function createChart() {
		if (!results || results.length === 0) {
			showGraph = false;
			return;
		} else {
			showGraph = true;
		}

		const gradeBoundaries = Array.from({ length: 7 }, (_, i) => ({
			label: `${i + 1}`,
			data: results.map((result) => {
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
			}),
			backgroundColor: colors[i],
			borderColor: borderColors[i],
			pointRadius: 5
		}));

		const filteredGradeBoundaries = gradeBoundaries.filter((_, i) => i + 1 === number);

		if (filteredGradeBoundaries.length === 0) {
			if (scatterChart) {
				scatterChart.destroy();
			}
			return;
		}

		if (scatterChart) {
			scatterChart.destroy();
		}

		scatterChart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				datasets: filteredGradeBoundaries
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						type: 'linear',
						position: 'bottom',
						title: {
							display: true,
							text: 'Year'
						},
						ticks: {
							callback: function (value) {
								return Number.isInteger(value) ? value : ''; // Display only integer values
							}
						}
					},
					y: {
						title: {
							display: true,
							text: 'Grade Boundary(%)'
						},
						ticks: {
							callback: function (value) {
								return value; // Return the raw value without formatting
							}
						}
					}
				},
				plugins: {
					legend: {
						display: true,
						onClick: null
					},
					tooltip: {
						callbacks: {
							title: function () {
								return '';
							},
							label: function (context) {
								const dataPoint = context.raw;
								let grade = context.raw.y;
								let fullName = dataPoint.fullName;

								return ` ${fullName}, ${grade}%`;
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
		if (language || number || results) {
			createChart();
		}
	}
</script>

{#if showGraph}
	<div class="title">
		Historical Grade Boundaries Graph for<br />
		{isAE ? `${name}` : `${level} ${language || ''} ${name}`}
	</div>
	<div class="dropdown">
		<Dropdown
			arr={isAE ? ['E', 'D', 'C', 'B', 'A'] : [1, 2, 3, 4, 5, 6, 7]}
			arrVal={isAE ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 7]}
			bind:value={number}
		/>
	</div>

	<div class="graph">
		<canvas bind:this={chartCanvas} class="" />
	</div>
{/if}

<style>
	.graph {
		height: 50vh;
	}

	@media screen and (max-width: 500px) {
		.graph {
			height: 30vh;
		}
	}
	.title {
		font-size: 1rem;
		margin: 10px 0;
		text-align: center;
	}
	.dropdown {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
	}
	.text {
		text-align: center;
	}
</style>
