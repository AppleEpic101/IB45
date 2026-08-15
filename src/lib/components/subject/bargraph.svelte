<script>
	import { onMount, tick } from 'svelte';
	import Chart from 'chart.js/auto';
	import { darkMode } from '$lib/stores/stores.js';
	import { buildBoundaryForecast, calculateForecastProbabilities } from '$lib/utils/forecast.js';

	export let name;
	export let level;
	export let grade;
	export let SLResults;
	export let HLResults;
	export let firstAssessment;

	const isCore = name === 'Theory Of Knowledge' || name === 'Extended Essay';
	const labels = isCore ? ['E', 'D', 'C', 'B', 'A'] : ['1', '2', '3', '4', '5', '6', '7'];
	const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6'];

	$: results = level === 'HL' ? HLResults : SLResults;
	$: comparableResults = results.filter(
		(result) => 2000 + Number(result.short?.slice(1, 3)) >= Number(firstAssessment || 0)
	);
	$: forecast = buildBoundaryForecast({
		results: comparableResults,
		targetYear: 2026,
		sessionPrefix: 'N',
		labels
	});
	$: probability = calculateForecastProbabilities(forecast, grade);
	$: featuredForecasts = forecast?.forecasts.slice(isCore ? 0 : 3) ?? [];
	$: rankedOutcomes = probability
		? probability.exact
				.map((chance, index) => ({ grade: forecast.forecasts[index].grade, chance }))
				.sort((a, b) => b.chance - a.chance)
		: [];
	$: primaryOutcome = rankedOutcomes[0];
	$: secondaryOutcome = rankedOutcomes[1];
	const probabilityLabel = (chance) => {
		if (chance >= 0.995) return '>99%';
		if (chance > 0 && chance <= 0.005) return '<1%';
		return `${Math.round(chance * 100)}%`;
	};

	let chartCanvas;
	let chartInstance;
	let expanded = false;
	const setExpanded = async (value) => {
		if (!value) {
			chartInstance?.destroy();
			chartInstance = undefined;
		}
		expanded = value;
		await tick();
		if (value) createChart();
	};
	const closeOnEscape = (event) => {
		if (expanded && event.key === 'Escape') setExpanded(false);
	};

	const createChart = () => {
		if (!chartCanvas || !forecast) return;
		const isDark = $darkMode;
		const textColor = isDark ? '#f8fafc' : '#0f172a';
		const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

		chartInstance?.destroy();
		chartInstance = new Chart(chartCanvas.getContext('2d'), {
			type: 'bar',
			data: {
				labels,
				datasets: [
					{
						label: '80% likely range',
						data: forecast.forecasts.map(({ lower, upper }) => [lower, upper]),
						backgroundColor: colors.slice(0, labels.length).map((color) => `${color}33`),
						borderColor: colors.slice(0, labels.length),
						borderWidth: 1,
						borderRadius: 6,
						barPercentage: 0.62
					},
					{
						type: 'line',
						label: 'Forecast',
						data: forecast.forecasts.map(({ point }) => point),
						showLine: false,
						pointRadius: 6,
						pointHoverRadius: 8,
						pointBackgroundColor: colors.slice(0, labels.length),
						pointBorderColor: '#ffffff',
						pointBorderWidth: 2
					},
					...(Number.isFinite(Number(grade))
						? [
								{
									type: 'line',
									label: 'Your mark',
									data: labels.map(() => Number(grade)),
									borderColor: '#38bdf8',
									borderWidth: 2,
									borderDash: [7, 5],
									pointRadius: 0,
									fill: false
								}
						  ]
						: [])
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: { mode: 'nearest', intersect: true },
				plugins: {
					legend: {
						position: 'top',
						labels: { color: textColor, usePointStyle: true, padding: 16 }
					},
					tooltip: {
						backgroundColor: isDark ? '#1e293b' : '#ffffff',
						titleColor: isDark ? '#f1f5f9' : '#1e293b',
						bodyColor: isDark ? '#cbd5e1' : '#475569',
						borderColor: isDark ? '#334155' : '#e2e8f0',
						borderWidth: 1,
						callbacks: {
							label: (item) =>
								item.dataset.label === '80% likely range'
									? ` 80% likely range: ${item.raw[0]}–${item.raw[1]}%`
									: ` ${item.dataset.label}: ${item.parsed.y}%`
						}
					}
				},
				scales: {
					x: {
						grid: { display: false },
						border: { display: false },
						title: {
							display: true,
							text: 'Predicted grade',
							color: textColor,
							font: { weight: 'bold' }
						},
						ticks: { color: textColor, font: { weight: '700' } }
					},
					y: {
						min: 0,
						max: 100,
						grid: { color: gridColor },
						border: { display: false },
						title: {
							display: true,
							text: 'Minimum mark (%)',
							color: textColor,
							font: { weight: 'bold' }
						},
						ticks: { color: textColor, callback: (value) => `${value}%` }
					}
				}
			}
		});
	};

	onMount(() => () => chartInstance?.destroy());

	$: if (expanded && chartCanvas && forecast && (grade !== undefined || $darkMode !== undefined)) {
		createChart();
	}
</script>

<svelte:window on:keydown={closeOnEscape} />

{#if forecast}
	{#if expanded}
		<button
			type="button"
			class="modal-backdrop"
			aria-label="Close expanded boundary forecast"
			on:click={() => setExpanded(false)}
		/>
	{/if}
	<section
		class="forecast-container"
		class:expanded
		role={expanded ? 'dialog' : undefined}
		aria-modal={expanded ? 'true' : undefined}
		aria-labelledby="forecast-title"
	>
		<button
			type="button"
			class="expand-button"
			aria-label={expanded ? 'Close forecast details' : 'View forecast details'}
			title={expanded ? 'Close' : 'View details'}
			on:click={() => setExpanded(!expanded)}
		>
			<span aria-hidden="true">{expanded ? '×' : '↗'}</span><span
				>{expanded ? 'Close' : 'Details'}</span
			>
		</button>

		<header class="forecast-header">
			<div class="eyebrow">
				<span>IB Predict forecast</span><span class="experimental">Experimental</span>
			</div>
			<h4 id="forecast-title">{forecast.targetName} boundary forecast</h4>
			<p>{level} {name} · built from comparable November examination sessions</p>
		</header>

		{#if probability}
			<div class="forecast-overview">
				<div class="personal-forecast">
					<span class="overview-label">Your {Number(grade).toFixed(0)}% mark</span>
					<div class="outcome-grid">
						<div class="primary-outcome">
							<strong>Grade {primaryOutcome.grade}</strong>
							<span>Most likely grade</span>
						</div>
						<div class="outcome-chance">
							<strong>{probabilityLabel(primaryOutcome.chance)}</strong>
							<span>Estimated likelihood</span>
						</div>
						{#if secondaryOutcome}
							<div class="secondary-outcome">
								<strong>{probabilityLabel(secondaryOutcome.chance)}</strong>
								<span>Grade {secondaryOutcome.grade}, next most likely</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		{#if expanded}
			<div class="forecast-body">
				<div class="graph-wrapper"><canvas bind:this={chartCanvas} /></div>
				<div class="forecast-bands" aria-label={`${forecast.targetName} predicted boundaries`}>
					{#each featuredForecasts as boundary}
						<div class="boundary-card">
							<div><span>Grade {boundary.grade}</span><strong>{boundary.point}%</strong></div>
							<p>80% range {boundary.lower}–{boundary.upper}%</p>
							<span class:high={boundary.confidence === 'High'} class="confidence"
								>{boundary.confidence} confidence</span
							>
						</div>
					{/each}
				</div>
			</div>
			<div class="model-meta">
				<span>{forecast.sessionCount} November sessions</span>
				<span
					>{forecast.mae === undefined
						? 'Limited backtest history'
						: `±${forecast.mae.toFixed(1)} mark backtest error`}</span
				>
				<span>Published through {forecast.trainingThrough}</span>
			</div>
		{/if}

		<a class="method-link" href="/blog/ib-predict-boundary-forecast-methodology">
			Read the forecast methodology <span aria-hidden="true">→</span>
		</a>
	</section>
{:else}
	<section class="forecast-container unavailable" aria-label="Boundary forecast unavailable">
		<div class="eyebrow">
			<span>IB Predict forecast</span><span class="experimental">Experimental</span>
		</div>
		<h4>November 2026 forecast unavailable</h4>
		<p>
			At least three comparable November sessions are required before IB Predict publishes an
			estimate for this syllabus.
		</p>
	</section>
{/if}

<style lang="scss">
	.forecast-container {
		position: relative;
		padding: 22px;
		margin: 20px 0 40px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 38%, var(--color-border));
		border-radius: var(--radius-lg);
		background: var(--color-surface);
		box-shadow: var(--shadow-md);

		&.expanded {
			position: fixed;
			inset: 24px;
			z-index: 1001;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			margin: 0;
		}
	}

	.unavailable {
		h4,
		p {
			margin: 0;
		}
		h4 {
			margin-top: 6px;
			color: var(--color-text-main);
		}
		p {
			margin-top: 4px;
			color: var(--color-text-muted);
			font-size: 0.8rem;
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

	.forecast-header {
		padding-right: 104px;
		h4,
		p {
			margin: 0;
		}
		h4 {
			margin-top: 4px;
			color: var(--color-text-main);
			font-size: 1.35rem;
		}
		p {
			margin-top: 3px;
			color: var(--color-text-muted);
			font-size: 0.82rem;
		}
	}
	.eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-primary);
		font-size: 0.68rem;
		font-weight: 850;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.experimental {
		padding: 3px 6px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-primary) 13%, transparent);
	}

	.forecast-overview {
		margin: 18px 0;
	}
	.personal-forecast {
		padding: 13px 14px;
		border: 1px solid var(--color-border);
		border-radius: 11px;
		background: var(--color-surface-variant);
	}
	.overview-label {
		color: var(--color-text-muted);
		font-size: 0.67rem;
		font-weight: 750;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.outcome-grid {
		display: grid;
		grid-template-columns: minmax(150px, 1fr) minmax(150px, 0.8fr) minmax(180px, 1fr);
		gap: 12px;
		align-items: center;
		margin-top: 8px;
	}
	.primary-outcome,
	.outcome-chance,
	.secondary-outcome {
		display: flex;
		flex-direction: column;
		span {
			color: var(--color-text-muted);
			font-size: 0.72rem;
		}
	}
	.primary-outcome strong,
	.outcome-chance strong {
		color: var(--color-primary);
		font-size: 1.75rem;
		line-height: 1.05;
	}
	.secondary-outcome {
		padding-left: 12px;
		border-left: 1px solid var(--color-border);
		strong {
			color: var(--color-text-main);
			font-size: 1rem;
		}
	}

	.forecast-body {
		display: grid;
		grid-template-columns: minmax(0, 1.65fr) minmax(220px, 0.8fr);
		gap: 16px;
		align-items: stretch;
	}
	.graph-wrapper {
		position: relative;
		height: 280px;
		min-width: 0;
		padding: 12px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background: var(--color-surface);
	}
	.forecast-bands {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.boundary-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 11px;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		background: var(--color-surface-variant);
		> div {
			display: flex;
			align-items: baseline;
			justify-content: space-between;
			gap: 8px;
			color: var(--color-text-main);
			font-size: 0.75rem;
			font-weight: 750;
		}
		strong {
			color: var(--color-primary);
			font-size: 1.3rem;
		}
		p {
			margin: 4px 0;
			color: var(--color-text-muted);
			font-size: 0.68rem;
		}
	}
	.confidence {
		align-self: flex-start;
		padding: 3px 6px;
		border-radius: 999px;
		background: color-mix(in srgb, #eab308 13%, transparent);
		color: #d97706;
		font-size: 0.62rem;
		font-weight: 800;
		&.high {
			background: color-mix(in srgb, #22c55e 13%, transparent);
			color: #16a34a;
		}
	}
	.model-meta {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		margin-top: 10px;
		color: var(--color-text-muted);
		font-size: 0.68rem;
		span + span::before {
			content: '·';
			margin-right: 12px;
		}
	}
	.method-link {
		display: inline-flex;
		gap: 5px;
		margin-top: 14px;
		color: var(--color-primary);
		font-size: 0.7rem;
		font-weight: 700;
		text-decoration: none;
		&:hover,
		&:focus-visible {
			text-decoration: underline;
		}
	}
	.expanded .forecast-body {
		flex: 1;
		min-height: 420px;
	}
	.expanded .graph-wrapper {
		height: auto;
		min-height: 420px;
	}

	@media (max-width: 800px) {
		.forecast-body {
			grid-template-columns: 1fr;
		}
		.forecast-bands {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	@media (max-width: 600px) {
		.forecast-container {
			padding: 16px;
		}
		.forecast-container.expanded {
			inset: 10px;
		}
		.forecast-header {
			padding-right: 42px;
		}
		.outcome-grid,
		.forecast-bands {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.graph-wrapper {
			height: 250px;
		}
		.secondary-outcome {
			grid-column: 1 / -1;
			padding: 8px 0 0;
			border-top: 1px solid var(--color-border);
			border-left: 0;
		}
		.model-meta {
			align-items: flex-start;
			flex-direction: column;
			gap: 3px;
			span + span::before {
				content: none;
			}
		}
		.expand-button span:last-child {
			display: none;
		}
	}
</style>
