<script>
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import { darkMode } from '$lib/stores/stores.js';

	export let title = '';
	export let labels = [];
	export let datasets = [];

	let canvas;
	let chart;

	const COLORS = ['#8b5cf6', '#22c55e', '#f59e0b'];

	function cssVar(name, fallback) {
		if (typeof window === 'undefined') return fallback;
		const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
		return v || fallback;
	}

	function build() {
		if (!canvas) return;
		chart?.destroy();

		const text = cssVar('--color-text-muted', '#475569');
		const grid = cssVar('--color-grid', 'rgba(0,0,0,0.1)');

		chart = new Chart(canvas, {
			type: 'line',
			data: {
				labels,
				datasets: datasets.map((d, i) => ({
					label: d.label,
					data: d.data,
					borderColor: COLORS[i % COLORS.length],
					backgroundColor: COLORS[i % COLORS.length] + '22',
					borderWidth: 2,
					pointRadius: 2.5,
					pointHoverRadius: 5,
					tension: 0.3,
					fill: false
				}))
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: { mode: 'index', intersect: false },
				plugins: {
					legend: {
						labels: { color: text, boxWidth: 10, boxHeight: 10, font: { size: 10 } }
					},
					tooltip: {
						callbacks: {
							label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} marks`
						}
					}
				},
				scales: {
					x: { ticks: { color: text, font: { size: 9 } }, grid: { color: grid } },
					y: {
						title: { display: true, text: 'Minimum mark /100', color: text, font: { size: 9 } },
						ticks: { color: text, font: { size: 9 } },
						grid: { color: grid }
					}
				}
			}
		});
	}

	onMount(build);
	onDestroy(() => chart?.destroy());

	// Rebuild on theme change so axis/legend colors stay readable
	$: if (chart && $darkMode !== undefined) build();
</script>

<figure class="chart">
	{#if title}<figcaption>{title}</figcaption>{/if}
	<div class="canvas-wrap"><canvas bind:this={canvas} /></div>
</figure>

<style lang="scss">
	.chart {
		align-self: stretch;
		margin: 0;
		padding: 10px 12px;
		background-color: var(--color-bg);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	figcaption {
		font-size: 0.72rem;
		color: var(--color-text-muted);
		margin-bottom: 6px;
		line-height: 1.35;
	}

	.canvas-wrap {
		position: relative;
		height: 170px;
	}
</style>
