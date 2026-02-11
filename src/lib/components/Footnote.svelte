<div class="footnotes">
	<div class="timezone-legend">
		<span><strong>TZ0:</strong> Worldwide</span>
		<span>•</span>
		<span><strong>TZ1:</strong> Americas</span>
		<span>•</span>
		<span><strong>TZ2:</strong> Europe, Africa, Asia-Pac</span>
	</div>

	<div class="notes-grid">
		<p>
			<strong>COVID Trend:</strong> N20–N22 boundaries were artificially lower than standard cycles.
		</p>
		<p>
			<strong>Syllabus:</strong> Beware of using outdated boundaries for updated subject syllabuses.
		</p>
		<p>
			<strong>Regional Trends:</strong> TZ2 generally has higher boundaries than TZ1; ensure your timezone
			is correct.
		</p>
		<p>
			<strong>Session Trends:</strong> November boundaries tend to be higher than May. Compare cycles
			carefully.
		</p>
	</div>
</div>

<style lang="scss">
	.footnotes {
		margin-top: 1rem;
		padding: 1.5rem;
		background: var(--color-surface-variant);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	.timezone-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		justify-content: center;
		margin-bottom: 1rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text-main);
		font-weight: 500;

		span strong {
			color: var(--color-primary);
		}
	}

	.notes-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;

		p {
			margin: 0;
			position: relative;
			padding-left: 0.5rem;
			border-left: 2px solid var(--color-border);

			strong {
				color: var(--color-text-main);
				display: block;
				font-size: 0.75rem;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				margin-bottom: 2px;
			}
		}
	}

	@media (max-width: 600px) {
		.timezone-legend {
			flex-direction: column;
			gap: 0.25rem;
			span:nth-child(even) {
				display: none;
			}
		}
	}
</style>
