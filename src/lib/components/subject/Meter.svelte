<script>
	export let value = 3;
	export let totalSegments = 7;
	export let isCore = false;

	const gradeMap = {
		5: 'A',
		4: 'B',
		3: 'C',
		2: 'D',
		1: 'E'
	};

	const radius = 80;
	const strokeWidth = 20;
	const gapAngle = 2; // gap between segments in degrees

	// Calculate the span of each arc based on total segments
	$: arcSpan = (180 - gapAngle * (totalSegments - 1)) / totalSegments;

	const colors = {
		1: 'rgba(255, 99, 132)',
		2: 'rgba(255, 159, 64)',
		3: 'rgba(255, 205, 86)',
		4: 'rgba(75, 192, 192)',
		5: 'rgba(138, 218, 234)',
		6: 'rgba(54, 162, 235)',
		7: 'rgba(153, 102, 255)',
		8: 'rgba(201, 203, 207)',
		9: 'rgba(255, 99, 255)',
		10: 'rgba(99, 255, 132)'
	};

	const getCurrentColor = (currentValue) => {
		return colors[currentValue] || colors[1];
	};

	const polarToCartesian = (cx, cy, r, angleDeg) => {
		const rad = (angleDeg * Math.PI) / 180;
		return {
			x: cx + r * Math.cos(rad),
			y: cy + r * Math.sin(rad)
		};
	};

	const getPath = (index) => {
		const startAngle = 180 + index * (arcSpan + gapAngle);
		const endAngle = startAngle + arcSpan;

		const start = polarToCartesian(100, 100, radius, startAngle);
		const end = polarToCartesian(100, 100, radius, endAngle);

		// Use largeArcFlag when arc is greater than 180 degrees
		const largeArcFlag = arcSpan > 180 ? 1 : 0;

		return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(' ');
	};

	// Clamp value to valid range
	$: clampedValue = Math.max(0, Math.min(value, totalSegments));
</script>

<svg width="200" height="120" viewBox="0 0 200 120">
	{#each Array(totalSegments) as _, i}
		<path
			d={getPath(i)}
			stroke={i < clampedValue ? getCurrentColor(clampedValue) : '#ddd'}
			stroke-width={strokeWidth}
			fill="none"
		/>
	{/each}
	<text x="100" y="105" text-anchor="middle" class="mark">
		{isCore ? gradeMap[clampedValue] : clampedValue}
	</text>
</svg>

<style>
	svg {
		display: block;
		margin: auto;
		border-radius: 8px;
	}

	.mark {
		font-size: 40px;
		font-weight: bold;
		fill: #333;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}
</style>
