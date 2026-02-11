<script>
	export let mark = 0;
	export let totalSegments = 7;
	export let isCore = false;
	const size = 125;
	const center = size / 2;
	const radius = 45;
	const strokeWidth = 12;

	const gapAngle = 8;
	const segmentAngle = 360 / totalSegments - gapAngle;
	const colors = [
		'rgba(255, 99, 132)',
		'rgba(255, 159, 64)',
		'rgba(255, 205, 86)',
		'rgba(75, 192, 192)',
		'rgba(138, 218, 234)',
		'rgba(54, 162, 235)',
		'rgba(153, 102, 255)',
		'rgba(201, 203, 207)',
		'rgba(255, 99, 255)',
		'rgba(99, 255, 132)'
	];
	const gradeMap = {
		E: 1,
		D: 2,
		C: 3,
		B: 4,
		A: 5
	};

	function polarToCartesian(cx, cy, r, angleInDegrees) {
		const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
		return {
			x: cx + r * Math.cos(angleInRadians),
			y: cy + r * Math.sin(angleInRadians)
		};
	}

	function describeArc(x, y, radius, startAngle, endAngle) {
		const start = polarToCartesian(x, y, radius, endAngle);
		const end = polarToCartesian(x, y, radius, startAngle);

		const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

		return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
	}
</script>

<svg width={size} height={size} viewBox="0 0 {size} {size}">
	<!-- Background Track -->
	{#each Array(totalSegments).fill(0) as _, i}
		<path
			d={describeArc(
				center,
				center,
				radius,
				i * (segmentAngle + gapAngle),
				i * (segmentAngle + gapAngle) + segmentAngle
			)}
			fill="none"
			stroke="var(--color-border)"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			opacity="0.5"
		/>
	{/each}

	<!-- Active Segments -->
	{#each Array(isCore ? gradeMap[mark] : mark).fill(0) as _, i}
		<path
			d={describeArc(
				center,
				center,
				radius,
				i * (segmentAngle + gapAngle),
				i * (segmentAngle + gapAngle) + segmentAngle
			)}
			fill="none"
			stroke={colors[i]}
			stroke-width={strokeWidth}
			stroke-linecap="round"
		/>
	{/each}
	<text
		x={center}
		y={center + 8}
		text-anchor="middle"
		font-size="24"
		font-weight="bold"
		fill="var(--color-text-main)"
	>
		{mark}
	</text>
</svg>
