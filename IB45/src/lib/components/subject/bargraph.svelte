<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let level;
	export let grade;
	export let SLResults;
	export let HLResults;

	let probabilities = Array(7).fill(0);

	let total;
	let count;

	$: {
		count = Array(7).fill(0);
		if (level === 'SL') {
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
		chartCanvas = new Chart(ctx, {
			type: 'bar',
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					y: {
						beginAtZero: true
					}
				}
			},
			data: {
				labels: labels,
				datasets: [
					{
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
