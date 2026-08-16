<details class="matrix-card">
	<summary>
		<div>
			<h5>How TOK and EE combine</h5>
			<p>Open the core-points table</p>
		</div>
		<span>Up to 3 points</span>
	</summary>

	<div class="matrix-scroll">
		<table aria-label="TOK and Extended Essay core points matrix">
			<thead>
				<tr
					><th class="axis" scope="col">EE ↓ · TOK →</th><th>A</th><th>B</th><th>C</th><th>D</th><th
						>E</th
					></tr
				>
			</thead>
			<tbody>
				<tr
					><th scope="row">A</th><td data-score="3">3</td><td data-score="3">3</td><td
						data-score="2">2</td
					><td data-score="2">2</td><td data-score="fail">Fail</td></tr
				>
				<tr
					><th scope="row">B</th><td data-score="3">3</td><td data-score="2">2</td><td
						data-score="2">2</td
					><td data-score="1">1</td><td data-score="fail">Fail</td></tr
				>
				<tr
					><th scope="row">C</th><td data-score="2">2</td><td data-score="2">2</td><td
						data-score="1">1</td
					><td data-score="0">0</td><td data-score="fail">Fail</td></tr
				>
				<tr
					><th scope="row">D</th><td data-score="2">2</td><td data-score="1">1</td><td
						data-score="0">0</td
					><td data-score="0">0</td><td data-score="fail">Fail</td></tr
				>
				<tr
					><th scope="row">E</th><td data-score="fail">Fail</td><td data-score="fail">Fail</td><td
						data-score="fail">Fail</td
					><td data-score="fail">Fail</td><td data-score="fail">Fail</td></tr
				>
			</tbody>
		</table>
	</div>
</details>

<style>
	.matrix-card {
		margin-top: 18px;
		padding: 16px;
		border: 1px solid var(--color-border);
		border-radius: 12px;
		background: color-mix(in srgb, var(--color-surface-variant) 50%, var(--color-surface));
	}
	summary {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		cursor: pointer;
		list-style-position: inside;
	}
	h5,
	p {
		margin: 0;
	}
	h5 {
		color: var(--color-text-main);
		font-size: 1rem;
	}
	p {
		margin-top: 3px;
		color: var(--color-text-muted);
		font-size: 0.75rem;
	}
	summary > span {
		padding: 4px 7px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
		border-radius: 999px;
		color: var(--color-primary);
		font-size: 0.66rem;
		font-weight: 800;
		white-space: nowrap;
	}
	.matrix-card[open] summary {
		margin-bottom: 12px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--color-border);
	}
	.matrix-scroll {
		width: 100%;
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 4px;
		color: var(--color-text-main);
	}
	th,
	td {
		height: 38px;
		padding: 4px 8px;
		border-radius: 7px;
		background: var(--color-surface-variant);
		text-align: center;
		font-weight: 750;
	}
	.axis {
		min-width: 110px;
		color: var(--color-text-muted);
		font-size: 0.68rem;
	}
	td[data-score] {
		color: #172033;
	}
	td[data-score='3'] {
		background: #86efac;
	}
	td[data-score='2'] {
		background: #fde68a;
	}
	td[data-score='1'] {
		background: #fdba74;
	}
	td[data-score='0'] {
		background: #fca5a5;
	}
	td[data-score='fail'] {
		background: #f87171;
	}

	@media screen and (max-width: 600px) {
		.matrix-card {
			padding: 12px;
		}
		summary {
			align-items: flex-start;
			flex-direction: column;
			gap: 8px;
		}
		table {
			border-spacing: 2px;
			table-layout: fixed;
		}
		th,
		td {
			height: 34px;
			padding: 3px;
			font-size: 0.72rem;
		}
		.axis {
			min-width: 0;
			font-size: 0.55rem;
		}
	}
</style>
