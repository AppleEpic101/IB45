<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { calculateNormalResults, calculateCoreResults } from '$lib/group.js';

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
			count[mark - 1]++;
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
	}

	const labels = len === 7 ? ['1', '2', '3', '4', '5', '6', '7'] : ['E', 'D', 'C', 'B', 'A'];
	let chartCanvas;
	let ctx;

	$: {
		probabilities = count.map((e) => e / total);
	}

	$: if (chartCanvas) {
		chartCanvas.data.datasets[0].data = probabilities;
		chartCanvas.update();
	}

	let exp;

	$: {
		exp = 0;
		for (let i = 0; i < probabilities.length; i++) {
			exp += (i + 1) * probabilities[i];
		}
	}

	onMount(() => {
		ctx = chartCanvas.getContext('2d');
		Chart.defaults.scales.linear.ticks.callback = function (value) {
			return value * 100 + '%';
		};
		chartCanvas = new Chart(ctx, {
			type: 'bar',
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					},
					title: {
						display: true,
						text: 'Predicted Mark Probability Distribution'
					}
				},
				scales: {
					y: {
						min: 0,
						max: 1.2,
						beginAtZero: true
					}
				}
			},
			data: {
				labels: labels,
				datasets: [
					{
						backgroundColor: [
							'rgba(255, 99, 132, 0.3)',
							'rgba(255, 159, 64, 0.3)',
							'rgba(255, 205, 86, 0.3)',
							'rgba(75, 192, 192, 0.3)',
							'rgba(138, 218, 234, 0.3)',
							'rgba(54, 162, 235, 0.3)',
							'rgba(153, 102, 255, 0.3)'
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(82, 201, 224)',
							'rgb(54, 162, 235)',
							'rgb(153, 102, 255)'
						],
						borderWidth: 1,
						label: 'Probability',
						data: probabilities
					}
				]
			}
		});
	});
</script>

<canvas bind:this={chartCanvas} />

<style>
</style>
