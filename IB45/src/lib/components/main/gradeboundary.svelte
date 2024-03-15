<script>
	import { gradeBoundary, gradeBoundaryData } from '$lib/stores/store.js';
	import M19 from '$lib/assets/Grade_BoundariesM19';
	import N19 from '$lib/assets/Grade_BoundariesN19';
	import N20 from '$lib/assets/Grade_BoundariesN20';
	import M21 from '$lib/assets/Grade_BoundariesM21';
	import M22 from '$lib/assets/Grade_BoundariesM22';
	import N22 from '$lib/assets/Grade_BoundariesN22';
	import M23 from '$lib/assets/Grade_BoundariesM23';
	import N23 from '$lib/assets/Grade_BoundariesN23';

	const str = ['M19', 'N19', 'N20', 'M21', 'M22', 'N22', 'M23', 'N23'];
	const gradeBoundaries = [M19, N19, N20, M21, M22, N22, M23, N23];
	let data = [];

	gradeBoundaries.forEach((b) => {
		let arr = Object.keys(b).map((courseName) => ({
			name: courseName,
			TZ: b[courseName].TZ
		}));
		data.push(arr);
	});

	$: {
		$gradeBoundaryData = data[str.indexOf($gradeBoundary)];
	}
</script>

<p><strong>Select the grade boundary.</strong></p>
<div class="wrap">
	{#each { length: gradeBoundaries.length } as _, i}
		<label>
			<input type="radio" name="r" value={'' + str[i]} bind:group={$gradeBoundary} />
			<div class="btn btn-sık"><span>{gradeBoundaries[i]['info'].name}</span></div>
		</label>
	{/each}
</div>

<style>
	.wrap {
		display: flex;
		flex-wrap: wrap;
	}
	label {
		position: relative;
		display: inline-block;
		text-align: center;
	}

	.btn:hover {
		cursor: pointer;
	}

	.btn {
		text-align: center;
	}
	.btn-sık {
		transition: all 0.2s ease;
		background-color: var(--lightprimary);
		border: 2px solid black;
		padding: 5px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: 0 1px 1px black;
	}

	input[type='radio'] {
		position: absolute;
		visibility: hidden;
	}

	input[type='radio']:checked + div {
		background-color: var(--banner);
	}
	input[type='radio']:checked + div > span {
		color: white;
		text-shadow: 0 2px 2px #808080;
	}
</style>
