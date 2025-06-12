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
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fillStyle = 'red';
			ctx.fillText('Mean', meanX + 4, top + 10);

			// Mark line
			const markX = x.getPixelForValue(mark);
			ctx.beginPath();
			ctx.moveTo(markX, top);
			ctx.lineTo(markX, bottom);
			ctx.strokeStyle = 'green';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.fillStyle = 'green';
			ctx.fillText('You', markX + 4, top + 25);

			ctx.restore();
		}
	};

	onMount(() => {
		const ctx = canvas.getContext('2d');

		const labels = ['N', '1', '2', '3', '4', '5', '6', '7'];

		const data = {
			labels,
			datasets: [
				{
					label: 'Percentage (%)',
					data: distribution,
					backgroundColor: 'rgba(54, 162, 235, 0.6)',
					borderWidth: 1
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
	});

	// Redraw chart when `mark` changes
	$: if (chartInstance && mark) {
		chartInstance.update();
	}

	$: if (chartInstance && distribution) {
		chartInstance.data.datasets[0].data = distribution;
		chartInstance.update();
	}
</script>

<div class="title">Grade Distributions for {name} (May 2024)</div>
<canvas bind:this={canvas} />

<style>
	.title {
		font-size: 1rem;
		margin: 10px 0;
		text-align: center;
	}
</style>
