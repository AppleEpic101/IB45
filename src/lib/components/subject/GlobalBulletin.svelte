<script>
	import Bulletin from '$lib/data/bulletin.js';
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import { darkMode } from '$lib/stores/stores.js';

	export let name;
	export let mark = 5;
	export let showBulletin;
	export let embedded = false;
	export let dataOverride;
	export let labelsOverride;
	export let colorsOverride;
	export let showSubtitle = true;
	export let selectedShort = 'N25';

	$: sessions = dataOverride ?? Bulletin[name]?.grades ?? [];
	$: labels = labelsOverride ?? ['N', '1', '2', '3', '4', '5', '6', '7'];
	$: if (sessions.length && !sessions.some((session) => session.short === selectedShort)) {
		selectedShort = sessions[0].short;
	}
	$: data = sessions.find((session) => session.short === selectedShort) ?? sessions[0];
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
	let chartUpdateId = 0;
	let expanded = false;
	const setExpanded = async (value) => {
		expanded = value;
		await tick();
		chartInstance?.resize();
	};
	const closeOnEscape = (event) => {
		if (expanded && event.key === 'Escape') setExpanded(false);
	};
	const selectSession = (short) => {
		if (short === selectedShort) return;

		chartInstance?.destroy();
		Chart.getChart(canvas)?.destroy();
		chartInstance = undefined;
		selectedShort = short;
	};
	const formatMean = (value) => {
		const numericMean = Number(value);
		if (!Number.isFinite(numericMean)) return 'Not available';

		const usesNumberGrades = labels.includes('1');
		if (usesNumberGrades) return numericMean.toFixed(1);

		const closestLabel = labels[Math.max(0, Math.min(labels.length - 1, Math.round(numericMean)))];
		return closestLabel ? `Grade ${closestLabel}` : 'Not available';
	};

	const createChart = () => {
		if (!distribution || distribution.length === 0 || !canvas) return;

		const isDark = $darkMode;
		const textColor = isDark ? '#f8fafc' : '#0f172a';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

		let validMean = parseFloat(mean) || 4;

		if (chartInstance) {
			chartInstance.data.datasets[0].data = distribution;
			chartInstance.options.plugins.tooltip.backgroundColor = isDark ? '#1e293b' : '#ffffff';
			chartInstance.options.plugins.tooltip.titleColor = isDark ? '#f1f5f9' : '#1e293b';
			chartInstance.options.plugins.tooltip.bodyColor = isDark ? '#cbd5e1' : '#475569';
			chartInstance.options.plugins.tooltip.borderColor = isDark ? '#334155' : '#e2e8f0';
			chartInstance.options.plugins.markers = { validMean, mark };
			chartInstance.options.scales.x.ticks.color = textColor;
			chartInstance.options.scales.y.grid.color = gridColor;
			chartInstance.options.scales.y.ticks.color = textColor;
			chartInstance.options.scales.y.title.color = textColor;
			chartInstance.update();
			return;
		}

		Chart.getChart(canvas)?.destroy();
		const ctx = canvas.getContext('2d');

		chartInstance = new Chart(ctx, {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						type: 'bar',
						label: 'Students',
						data: distribution,
						backgroundColor: colorsOverride ?? [
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
						order: 1
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
					markers: { validMean, mark },
					tooltip: {
						backgroundColor: isDark ? '#1e293b' : '#ffffff',
						titleColor: isDark ? '#f1f5f9' : '#1e293b',
						bodyColor: isDark ? '#cbd5e1' : '#475569',
						borderColor: isDark ? '#334155' : '#e2e8f0',
						borderWidth: 1,
						padding: 12,
						displayColors: true,
						callbacks: {
							label: (item) => ` ${item.parsed.y}% of students`
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
							text: 'Students (%)',
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
							scales: { x },
							options: {
								plugins: {
									markers: { validMean, mark: currentMark }
								}
							}
						} = chart;
						ctx.save();

						if (validMean !== undefined && !isNaN(validMean)) {
							const baseIdx = Math.max(0, Math.min(labels.length - 2, Math.floor(validMean)));
							const nextIdx = Math.min(labels.length - 1, baseIdx + 1);
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

								}
							}
						}

						if (currentMark !== undefined && currentMark !== 'N/A') {
							const markIdx = labels.indexOf(currentMark.toString());
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

								}
							}
						}
						ctx.restore();
					}
				}
			]
		});
	};

	const scheduleChartUpdate = async () => {
		const updateId = ++chartUpdateId;
		await tick();
		if (updateId === chartUpdateId) createChart();
	};

	onMount(() => {
		return () => {
			chartUpdateId += 1;
			if (chartInstance) chartInstance.destroy();
		};
	});

	$: if (canvas && distribution && (name || $darkMode !== undefined || mark)) {
		scheduleChartUpdate();
	}
</script>

<svelte:window on:keydown={closeOnEscape} />

{#if showBulletin}
	{#if expanded}
		<button
			type="button"
			class="modal-backdrop"
			aria-label="Close expanded grade distribution"
			on:click={() => setExpanded(false)}
		/>
	{/if}
	<div
		class="distribution-container"
		class:embedded
		class:expanded
		role={expanded ? 'dialog' : undefined}
		aria-modal={expanded ? 'true' : undefined}
		aria-labelledby="global-distribution-title"
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
			<h4 class="title" id="global-distribution-title">Global Grade Distribution</h4>
			{#if showSubtitle}
				<p class="subtitle">
					{data?.name} · {total?.toLocaleString()} students
				</p>
			{/if}
			{#if sessions.length > 1}
				<div class="session-switcher" aria-label="Exam session">
					{#each sessions as session}
						<button
							type="button"
							class:active={session.short === selectedShort}
							aria-pressed={session.short === selectedShort}
							on:click={() => selectSession(session.short)}
						>
							{session.name}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<div class="chart-summary" aria-label="Grade distribution summary">
			{#if mark !== undefined && mark !== 'N/A'}
				<div>
					<span>Your result</span>
					<strong>{labels.includes(String(mark)) ? `Grade ${mark}` : mark}</strong>
				</div>
			{/if}
			<div>
				<span>Session average</span>
				<strong>{labels.includes('1') ? `Grade ${formatMean(mean)}` : formatMean(mean)}</strong>
			</div>
		</div>
		<div class="graph-wrapper">
			{#key selectedShort}
				<canvas bind:this={canvas} />
			{/key}
		</div>
		<details class="chart-help">
			<summary>How to read this chart</summary>
			<div>
				<p>Each bar is the percentage of students who finished with that grade.</p>
				<p>The green line marks your predicted grade. The dashed red line marks the session average.</p>
				<a href="/blog/understanding-your-ib-predict-results">Read the plain-language results guide →</a>
			</div>
		</details>
	</div>
{/if}

<style lang="scss">
	.distribution-container {
		position: relative;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 24px;
		margin: 20px 0 40px 0;
		box-shadow: var(--shadow-md);

		&.embedded {
			padding: 0;
			margin: 0;
			border: 0;
			border-radius: 0;
			box-shadow: none;
		}

		&.expanded {
			position: fixed;
			inset: 24px;
			z-index: 1001;
			display: flex;
			flex-direction: column;
			padding: 24px;
			margin: 0;
			border: 1px solid var(--color-border);
			border-radius: var(--radius-lg);
			background: var(--color-surface);
			box-shadow: var(--shadow-lg);
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
		top: 0;
		right: 0;
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

		&:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
		}
	}

	.expanded .expand-button {
		top: 18px;
		right: 18px;
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

	.chart-summary {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin: -8px 0 12px;

		div {
			display: flex;
			align-items: baseline;
			gap: 6px;
			padding: 6px 10px;
			border: 1px solid var(--color-border);
			border-radius: 999px;
			background: var(--color-surface-variant);
		}

		span {
			color: var(--color-text-muted);
			font-size: 0.72rem;
		}

		strong {
			color: var(--color-text-main);
			font-size: 0.78rem;
		}
	}

	.session-switcher {
		display: inline-flex;
		gap: 4px;
		padding: 4px;
		margin-top: 16px;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: var(--color-surface-variant);

		button {
			border: 0;
			border-radius: 999px;
			padding: 8px 14px;
			background: transparent;
			color: var(--color-text-muted);
			font: inherit;
			font-size: 0.875rem;
			font-weight: 700;
			cursor: pointer;
			transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;

			&:hover,
			&:focus-visible {
				color: var(--color-text-main);
			}

			&:focus-visible {
				outline: 2px solid var(--color-primary);
				outline-offset: 2px;
			}

			&.active {
				background: var(--color-surface);
				color: var(--color-primary);
				box-shadow: var(--shadow-sm);
			}
		}
	}

	.graph-wrapper {
		height: 280px;
		position: relative;
	}

	.chart-help {
		margin-top: 12px;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);

		summary {
			padding-top: 10px;
			font-size: 0.78rem;
			font-weight: 700;
			cursor: pointer;
		}

		div {
			max-width: 680px;
			padding-top: 8px;
			font-size: 0.78rem;
			line-height: 1.5;
		}

		p {
			margin: 0 0 4px;
		}

		a {
			display: inline-block;
			margin-top: 4px;
			color: var(--color-primary);
			font-weight: 700;
			text-decoration: none;
		}
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

		.graph-wrapper {
			height: 230px;
		}
		.distribution-header {
			padding-top: 34px;
		}
		.chart-summary {
			align-items: stretch;
			margin-top: -4px;

			div {
				flex: 1;
				align-items: flex-start;
				flex-direction: column;
				gap: 2px;
				border-radius: 9px;
			}
		}
		.session-switcher {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			width: 100%;
			border-radius: 12px;

			button {
				min-width: 0;
				padding: 8px 5px;
				border-radius: 9px;
				font-size: 0.72rem;
				white-space: normal;
			}
		}
		.distribution-container.expanded {
			inset: 10px;
			padding: 16px;
		}
		.expanded .graph-wrapper {
			height: auto;
		}
		.expand-button span:last-child {
			display: none;
		}
	}
</style>
