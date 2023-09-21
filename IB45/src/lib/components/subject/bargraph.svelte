<script>
	import { onMount } from 'svelte';
	import d from '$lib/assets/courses.json';
	import Chart from 'chart.js/auto';

	export let name;
	export let level;
	export let region;
	export let grade;
	export let SLResults;
	export let HLResults;
	export let historyResults;

	let probabilities = Array(7).fill(0);

	let total;
	let count;

	$: {
		count = Array(7).fill(0);
		if (name === 'History' && level === 'HL') {
			total = historyResults[historyResults].length;
		} else if (level === 'SL') {
			total = SLResults.length;
			SLResults.forEach((b) => {
				let mark = 0;
				b.tz.forEach((e) => {
					if (grade >= e) mark++;
				});
				count[mark - 1]++;
			});
		} else if (level === 'HL') {
			total = HLResults.length;
			HLResults.forEach((b) => {
				let mark = 0;
				b.tz.forEach((e) => {
					if (grade >= e) mark++;
				});
				count[mark - 1]++;
			});
		}
	}

	const labels = ['1', '2', '3', '4', '5', '6', '7'];
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
						max: 1,
						beginAtZero: true
					}
				}
			},
			data: {
				labels: labels,
				datasets: [
					{
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(54, 162, 235, 0.2)',
							'rgba(153, 102, 255, 0.2)',
							'rgba(201, 203, 207, 0.2)'
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(54, 162, 235)',
							'rgb(153, 102, 255)',
							'rgb(201, 203, 207)'
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
