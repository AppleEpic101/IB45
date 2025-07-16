<script>
	import Bulletin from '$lib/assets/Bulletin.json';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let name;
	export let mark = 5;
	export let showBulletin;

	$: data = Bulletin[name]?.grades?.[0];
	let total, mean, distribution;

	$: {
		if (!data) {
			showBulletin = false;
		} else {
			showBulletin = true;
		}
	}

	$: {
		total = data?.total;
		mean = data?.mean;
		distribution = data?.distribution;
	}

	let canvas;
	let chartInstance;

	// Plugin to draw vertical lines
	const verticalLinePlugin = {
		id: 'verticalLines',
		afterDraw(chart) {
			const {
				ctx,
				chartArea: { top, bottom },
				scales: { x }
			} = chart;

			ctx.save();

			// Mean line
			const meanX = x.getPixelForValue(mean);
			ctx.beginPath();
			ctx.moveTo(meanX, top);
			ctx.lineTo(meanX, bottom);
			ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // semi-transparent red
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			ctx.font = '12px sans-serif';
			ctx.fillText('Mean', meanX + 4, top + 10);

			// Mark line
			const markX = x.getPixelForValue(mark);
			ctx.beginPath();
			ctx.moveTo(markX, top);
			ctx.lineTo(markX, bottom);
			ctx.strokeStyle = 'rgba(0, 128, 0, 0.5)'; // semi-transparent green
			ctx.lineWidth = 10;
			ctx.stroke();
			ctx.fillStyle = 'rgba(0, 128, 0, 0.5)';
			ctx.fillText('You', markX + 4, top + 25);

			ctx.restore();
		}
	};

	const createChart = () => {
		if (!distribution || distribution.length === 0) return;
		if (chartInstance) {
			chartInstance.destroy();
		}
		const ctx = canvas.getContext('2d');

		const labels = ['N', '1', '2', '3', '4', '5', '6', '7'];

		const data = {
			labels,
			datasets: [
				{
					backgroundColor: [
						'rgba(255, 99, 132, 0.3)',
						'rgba(255, 159, 64, 0.3)',
						'rgba(255, 205, 86, 0.3)',
						'rgba(75, 192, 192, 0.3)',
						'rgba(138, 218, 234, 0.3)',
						'rgba(54, 162, 235, 0.3)',
						'rgba(153, 102, 255, 0.3)'
					],
					borderColor: [
						'rgb(255, 99, 132)',
						'rgb(255, 159, 64)',
						'rgb(255, 205, 86)',
						'rgb(75, 192, 192)',
						'rgb(82, 201, 224)',
						'rgb(54, 162, 235)',
						'rgb(153, 102, 255)'
					],
					borderWidth: 1,
					label: 'Percentage (%)',
					data: distribution
				}
			]
		};

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data,
			options: {
				scales: {
					y: {
						min: 0,

						beginAtZero: true,
						title: {
							display: true,
							text: 'Percent of Test Takers (%)'
						},
						ticks: {
							callback: function (value) {
								return value + '%';
							}
						}
					}
				},
				plugins: {
					legend: {
						display: false
					}
				}
			},
			plugins: [verticalLinePlugin]
		});
	};

	// Wait for DOM and data to be ready
	onMount(() => {
		if (canvas && distribution) {
			createChart();
		}
	});

	// Recreate chart when name or distribution changes
	$: if (canvas && (distribution || name)) {
		createChart();
	}

	// Redraw chart when `mark` changes
	$: if (chartInstance && mark) {
		chartInstance.update();
	}
</script>

{#if showBulletin}
	<div class="graph">
		<div class="title">May 2024 Grade Distributions for {name}</div>
		<canvas bind:this={canvas} />
	</div>
{/if}

<style>
	.graph {
		margin: 0 auto 80px auto;
		height: 35vh;
		max-width: 75vh;
	}

	.title {
		font-size: 1rem;
		margin: 10px 0;
		text-align: center;
	}

	.hidden {
		visibility: hidden;
		height: 0;
	}

	.chart-container {
		width: 100%;
	}
</style>
