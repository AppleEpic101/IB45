<script>
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import { darkMode } from '$lib/stores/stores.js';

	export let name;
	export let level;
	export let grade;
	export let SLResults;
	export let HLResults;

	const len = name === 'Theory Of Knowledge' || name === 'Extended Essay' ? 5 : 7;
	let probabilities = Array(len).fill(0);

	let total;
	let count;

	const calculate = (arr, grade, count) => {
		arr.forEach((b) => {
			let mark = 0;
			b.tz.forEach((e) => {
				if (grade >= e) mark++;
			});
			if (mark > 0) count[mark - 1]++;
		});
		return count;
	};

	$: {
		count = Array(len).fill(0);
		if (level === 'HL') {
			total = HLResults.length;
			count = calculate(HLResults, grade, count);
		} else {
			total = SLResults.length;
			count = calculate(SLResults, grade, count);
		}
		probabilities = count.map((e) => e / (total || 1));
	}

	const labels = len === 7 ? ['1', '2', '3', '4', '5', '6', '7'] : ['E', 'D', 'C', 'B', 'A'];
	let chartCanvas;
	let chartInstance;
	let expanded = false;
	const setExpanded = async (value) => {
		expanded = value;
		await tick();
		chartInstance?.resize();
	};
	const closeOnEscape = (event) => {
		if (expanded && event.key === 'Escape') setExpanded(false);
	};

	const createChart = () => {
		if (!chartCanvas) return;
		const ctx = chartCanvas.getContext('2d');
		const isDark = $darkMode;
		const textColor = isDark ? '#f8fafc' : '#0f172a';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

		if (chartInstance) chartInstance.destroy();

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: 'Probability',
						data: probabilities,
						backgroundColor: [
							'rgba(244, 63, 94, 0.7)',
							'rgba(249, 115, 22, 0.7)',
							'rgba(245, 158, 11, 0.7)',
							'rgba(16, 185, 129, 0.7)',
							'rgba(20, 184, 166, 0.7)',
							'rgba(59, 130, 246, 0.7)',
							'rgba(139, 92, 246, 0.7)'
						],
						borderRadius: 8
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
						callbacks: {
							label: (item) => {
								const val = (parseFloat(item.parsed.y) || 0) * 100;
								return ` ${val.toFixed(1)}% chance`;
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
							callback: (value) => (value * 100).toFixed(0) + '%'
						}
					}
				}
			}
		});
	};

	onMount(() => {
		createChart();
		return () => {
			if (chartInstance) chartInstance.destroy();
		};
	});

	$: if (chartCanvas && probabilities && (probabilities.length > 0 || $darkMode !== undefined)) {
		createChart();
	}
</script>

<svelte:window on:keydown={closeOnEscape} />

{#if expanded}
	<button
		type="button"
		class="modal-backdrop"
		aria-label="Close expanded probability graph"
		on:click={() => setExpanded(false)}
	/>
{/if}
<div
	class="distribution-container"
	class:expanded
	role={expanded ? 'dialog' : undefined}
	aria-modal={expanded ? 'true' : undefined}
	aria-labelledby="probability-title"
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
	<div class="distribution-header">
		<h4 class="title" id="probability-title">Predicted Mark Probability</h4>
		<p class="subtitle">Likelihood of each grade based on historical session boundaries</p>
	</div>
	<div class="graph-wrapper">
		<canvas bind:this={chartCanvas} />
	</div>
</div>

<style lang="scss">
	.distribution-container {
		position: relative;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 24px;
		margin: 20px 0 40px 0;
		box-shadow: var(--shadow-md);

		&.expanded {
			position: fixed;
			inset: 24px;
			z-index: 1001;
			display: flex;
			flex-direction: column;
			margin: 0;
			background: var(--color-surface);
		}
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
		top: 14px;
		right: 14px;
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

	.distribution-header {
		text-align: center;
		margin-bottom: 24px;

		.title {
			font-size: 1.1rem;
			font-weight: 800;
			margin: 0;
			color: var(--color-text-main);
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		.subtitle {
			font-size: 0.85rem;
			color: var(--color-text-muted);
			margin: 4px 0 0 0;
		}
	}

	.graph-wrapper {
		height: 260px;
		position: relative;
	}

	.expanded .graph-wrapper {
		flex: 1;
		height: auto;
		min-height: 0;
	}

	@media (max-width: 600px) {
		.distribution-container {
			padding: 16px;
		}

		.distribution-container.expanded {
			inset: 10px;
		}

		.graph-wrapper {
			height: 220px;
		}

		.expanded .graph-wrapper {
			height: auto;
		}

		.expand-button span:last-child {
			display: none;
		}
	}
</style>
