<script>
  export let mark = 0;
  const size = 125;
  const center = size / 2;
  const radius = 45;
  const strokeWidth = 10;

  const totalSegments = 7;
  const gapAngle = 0;
  const segmentAngle = (360 / totalSegments) - gapAngle;
  const rainbow = Array.from({ length: totalSegments }, (_, i) => `hsl(${(i + 1) / 5 * 120}, 100%, 68%)`);

  function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians)
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  }
</script>

<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <g>
  {#each Array(mark).fill(0) as _, i}
    <path
      d="{describeArc(center, center, radius, i * (segmentAngle + gapAngle), i * (segmentAngle + gapAngle) + segmentAngle)}"
      fill="none"
      stroke="{rainbow[i]}"
      stroke-width="{strokeWidth}"
      stroke-linecap="round"
    />
  {/each}
  </g>
  <text x="{center}" y="{center + 7}" text-anchor="middle" font-size="20" font-weight="bold" fill="black">
    {mark}
  </text>
</svg>