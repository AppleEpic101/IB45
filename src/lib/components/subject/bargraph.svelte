<script>
	import { onMount } from 'svelte';
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

<div class="distribution-container">
	<div class="distribution-header">
		<h4 class="title">Predicted Mark Probability</h4>
		<p class="subtitle">Likelihood of each grade based on historical session boundaries</p>
	</div>
	<div class="graph-wrapper">
		<canvas bind:this={chartCanvas} />
	</div>
</div>

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
		height: 40vh;
		position: relative;
	}
</style>
