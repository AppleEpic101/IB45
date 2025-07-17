<table>
	<thead>
		<tr><th colspan="6">Core Points Matrix</th></tr>
		<tr
			><th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr
		>
	</thead>
	<tbody>
		<tr
			><th>A</th><td data-score="3">3</td><td data-score="3">3</td><td data-score="2">2</td><td
				data-score="2">2</td
			><td data-score="fail">Fail</td></tr
		>
		<tr
			><th>B</th><td data-score="3">3</td><td data-score="2">2</td><td data-score="2">2</td><td
				data-score="1">1</td
			><td data-score="fail">Fail</td></tr
		>
		<tr
			><th>C</th><td data-score="2">2</td><td data-score="2">2</td><td data-score="1">1</td><td
				data-score="0">0</td
			><td data-score="fail">Fail</td></tr
		>
		<tr
			><th>D</th><td data-score="2">2</td><td data-score="1">1</td><td data-score="0">0</td><td
				data-score="0">0</td
			><td data-score="fail">Fail</td></tr
		>
		<tr
			><th>E</th><td data-score="fail">Fail</td><td data-score="fail">Fail</td><td data-score="fail"
				>Fail</td
			><td data-score="fail">Fail</td><td data-score="fail">Fail</td></tr
		>
	</tbody>
</table>

<style>
	table,
	tr,
	th,
	td {
		border: 1px solid #d1d5db;
		border-collapse: collapse;
		text-align: center;
		background-color: #e0f2fe;
	}

	table {
		width: 25vw;
		margin-bottom: 20px;
		margin-left: 5px;
	}

	th,
	tr {
		padding: 5px;
	}

	/* Green to Red Spectrum */
	td[data-score='3'] {
		background-color: #86efac; /* green */
	}
	td[data-score='2'] {
		background-color: #fde68a; /* yellow */
	}
	td[data-score='1'] {
		background-color: #fdba74; /* orange */
	}
	td[data-score='0'] {
		background-color: #fca5a5; /* light red */
	}
	td[data-score='fail'] {
		background-color: #f87171; /* dark red */
	}

	@media screen and (max-width: 320px) {
		table {
			max-width: 100%;
			font-size: x-small;
		}
	}

	@media screen and (max-width: 235px) {
		table {
			font-size: xx-small;
		}
	}
</style>
