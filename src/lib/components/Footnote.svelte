<details class="footnotes">
	<summary>
		<span>About sessions and timezones</span>
		<small>Optional reference</small>
	</summary>

	<div class="footnote-content">
		<div class="timezone-legend">
			<span><strong>TZ0:</strong> Worldwide or combined</span>
			<span>•</span>
			<span><strong>TZ1 / TZ2 / TZ3:</strong> Different paper variants</span>
		</div>

		<div class="notes-grid">
			<p>
				<strong>Choose the matching variant</strong> Use the boundary label supplied with your paper
				or results. Ask your coordinator when it is unclear.
			</p>
			<p>
				<strong>Match the syllabus</strong> Compare sessions from the same course version whenever possible.
			</p>
			<p>
				<strong>Treat 2020–2022 carefully</strong> Examination arrangements changed during the pandemic,
				so those sessions may not be directly comparable.
			</p>
			<p>
				<strong>Compare like with like</strong> May and November sessions have different student groups.
				A past pattern does not determine a future boundary.
			</p>
		</div>

		<a href="/blog/choosing-an-ib-exam-session-and-timezone">
			Read the session and timezone guide <span aria-hidden="true">→</span>
		</a>
	</div>
</details>

<style lang="scss">
	.footnotes {
		margin-top: 1rem;
		background: var(--color-surface-variant);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 0.8rem;
		line-height: 1.4;
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding: 12px 14px;
		color: var(--color-text-main);
		font-weight: 750;
		cursor: pointer;
		list-style-position: inside;
	}

	summary::marker {
		color: var(--color-primary);
	}

	summary small {
		color: var(--color-text-muted);
		font-size: 0.68rem;
		font-weight: 600;
	}

	.footnote-content {
		padding: 0 1.25rem 1.25rem;
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

	.footnote-content > a {
		display: inline-flex;
		gap: 5px;
		margin-top: 14px;
		color: var(--color-primary);
		font-weight: 750;
		text-decoration: none;
	}

	.footnote-content > a:hover,
	.footnote-content > a:focus-visible {
		text-decoration: underline;
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
		summary small {
			display: none;
		}
		.timezone-legend {
			flex-direction: column;
			gap: 0.25rem;
			span:nth-child(even) {
				display: none;
			}
		}
	}
</style>
