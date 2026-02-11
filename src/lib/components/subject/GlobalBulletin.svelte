<script>
	import Bulletin from '$lib/assets/Bulletin.json';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { darkMode } from '$lib/stores/stores.js';

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

	const getNormalDistributionValue = (x, mu, sigma) => {
		if (!sigma || sigma === 0) return 0;
		return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
	};

	const createChart = () => {
		if (!distribution || distribution.length === 0 || !canvas) return;

		const ctx = canvas.getContext('2d');
		const isDark = $darkMode;
		const textColor = isDark ? '#f8fafc' : '#0f172a';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

		const labels = ['N', '1', '2', '3', '4', '5', '6', '7'];

		// Calculate SD for normal curve if mean exists
		let validMean = parseFloat(mean) || 4;
		let sd = 1.2;

		if (distribution) {
			let variance = 0;
			let totalWeight = 0;
			distribution.forEach((p, i) => {
				const prob = parseFloat(p) / 100;
				variance += prob * Math.pow(i - validMean, 2);
				totalWeight += prob;
			});
			if (totalWeight > 0) {
				sd = Math.sqrt(variance / totalWeight) || 1.2;
			}
		}

		// Generate points for the normal distribution trace
		const maxBar = Math.max(...distribution, 1);
		const maxCurve = getNormalDistributionValue(validMean, validMean, sd) || 1;

		const traceData = labels.map((_, i) => {
			const val = getNormalDistributionValue(i, validMean, sd);
			return (val / maxCurve) * maxBar;
		});

		if (chartInstance) {
			chartInstance.destroy();
		}

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						type: 'line',
						label: 'Normal Trace',
						data: traceData,
						borderColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(15, 23, 42, 0.3)',
						borderWidth: 3,
						pointRadius: 0,
						fill: false,
						tension: 0.45,
						order: 1
					},
					{
						type: 'bar',
						label: 'Percentage (%)',
						data: distribution,
						backgroundColor: [
							'rgba(244, 63, 94, 0.7)',
							'rgba(244, 63, 94, 0.7)',
							'rgba(249, 115, 22, 0.7)',
							'rgba(245, 158, 11, 0.7)',
							'rgba(16, 185, 129, 0.7)',
							'rgba(20, 184, 166, 0.7)',
							'rgba(59, 130, 246, 0.7)',
							'rgba(139, 92, 246, 0.7)'
						],
						borderRadius: 8,
						borderWidth: 0,
						order: 2
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					tooltip: {
						backgroundColor: isDark ? '#1e293b' : '#ffffff',
						titleColor: isDark ? '#f1f5f9' : '#1e293b',
						bodyColor: isDark ? '#cbd5e1' : '#475569',
						borderColor: isDark ? '#334155' : '#e2e8f0',
						borderWidth: 1,
						padding: 12,
						displayColors: true,
						callbacks: {
							label: (item) => {
								if (item.dataset.label === 'Normal Trace') return null;
								return ` ${item.parsed.y}% of test takers`;
							}
						}
					}
				},
				scales: {
					x: {
						grid: { display: false },
						border: { display: false },
						ticks: { color: textColor, font: { weight: '600' } }
					},
					y: {
						beginAtZero: true,
						grid: { color: gridColor },
						border: { display: false },
						ticks: {
							color: textColor,
							callback: (value) => value + '%'
						},
						title: {
							display: true,
							text: 'Population Percentage',
							color: textColor,
							font: { size: 12, weight: '500' }
						}
					}
				}
			},
			plugins: [
				{
					id: 'markers',
					afterDraw: (chart) => {
						const {
							ctx,
							chartArea: { top, bottom },
							scales: { x }
						} = chart;
						ctx.save();

						if (validMean !== undefined && !isNaN(validMean)) {
							const baseIdx = Math.max(0, Math.min(6, Math.floor(validMean)));
							const nextIdx = Math.min(7, baseIdx + 1);
							const remainder = validMean - baseIdx;

							const p1 = x.getPixelForValue(labels[baseIdx]);
							const p2 = x.getPixelForValue(labels[nextIdx]);

							if (p1 !== undefined && p2 !== undefined) {
								const xPos = p1 + (p2 - p1) * remainder;

								if (!isNaN(xPos)) {
									ctx.setLineDash([5, 5]);
									ctx.strokeStyle = '#ef4444';
									ctx.lineWidth = 2;
									ctx.beginPath();
									ctx.moveTo(xPos, top);
									ctx.lineTo(xPos, bottom);
									ctx.stroke();

									ctx.fillStyle = '#ef4444';
									ctx.font = 'bold 11px Inter';
									ctx.fillText('AVG: ' + validMean.toFixed(1), xPos + 5, top + 15);
								}
							}
						}

						if (mark !== undefined && mark !== 'N/A') {
							const markIdx = labels.indexOf(mark.toString());
							if (markIdx !== -1) {
								const markX = x.getPixelForValue(labels[markIdx]);
								if (markX !== undefined && !isNaN(markX)) {
									ctx.setLineDash([]);
									ctx.strokeStyle = '#22c55e';
									ctx.lineWidth = 3;
									ctx.beginPath();
									ctx.moveTo(markX, top);
									ctx.lineTo(markX, bottom);
									ctx.stroke();

									ctx.fillStyle = '#22c55e';
									ctx.font = 'bold 11px Inter';
									ctx.fillText('YOU', markX + 5, top + 35);
								}
							}
						}
						ctx.restore();
					}
				}
			]
		});
	};

	onMount(() => {
		createChart();
		return () => {
			if (chartInstance) chartInstance.destroy();
		};
	});

	$: if (canvas && distribution && (name || $darkMode !== undefined || mark)) {
		createChart();
	}
</script>

{#if showBulletin}
	<div class="distribution-container">
		<div class="distribution-header">
			<h4 class="title">Global Grade Distribution</h4>
			<p class="subtitle">
				Based on {data?.name} session results ({total?.toLocaleString()} candidates)
			</p>
		</div>
		<div class="graph-wrapper">
			<canvas bind:this={canvas} />
		</div>
	</div>
{/if}

<style lang="scss">
	.distribution-container {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 24px;
		margin: 20px 0 40px 0;
		box-shadow: var(--shadow-md);
	}

	.distribution-header {
		text-align: center;
		margin-bottom: 24px;

		.title {
			font-size: 1.25rem;
			font-weight: 800;
			margin: 0;
			color: var(--color-text-main);
			letter-spacing: -0.02em;
		}

		.subtitle {
			font-size: 0.875rem;
			color: var(--color-text-muted);
			margin: 4px 0 0 0;
		}
	}

	.graph-wrapper {
		height: 40vh;
		position: relative;
	}

	@media (max-width: 600px) {
		.distribution-container {
			padding: 16px;
		}
		.graph-wrapper {
			height: 30vh;
		}
	}
</style>
