<script>
	import { gradeBoundary, gradeBoundaryData } from '$lib/stores/store.js';
	import M19 from '$lib/assets/Grade_BoundariesM19';
	import N19 from '$lib/assets/Grade_BoundariesN19';
	import N20 from '$lib/assets/Grade_BoundariesN20';
	import M21 from '$lib/assets/Grade_BoundariesM21';
	import M22 from '$lib/assets/Grade_BoundariesM22';
	import N22 from '$lib/assets/Grade_BoundariesN22';

	const str = ['M19', 'N19', 'N20', 'M21', 'M22', 'N22'];
	const gradeBoundaries = [M19, N19, N20, M21, M22, N22];
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

<div class="body">
	<h3>Select the grade boundary.</h3>

	<div class="buttons">
		{#each { length: gradeBoundaries.length } as _, i}
			<input
				type="radio"
				label={gradeBoundaries[i]['info'].name}
				value={'' + str[i]}
				bind:group={$gradeBoundary}
			/>
		{/each}
	</div>
</div>

<style>
	.buttons {
		padding: 4px;
		border-radius: 3px;
		position: relative;
		width: fit-content;
	}

	.buttons input {
		appearance: none;
		cursor: pointer;
		border-radius: 10px;
		padding: 5px 10px;
		background-color: var(--lightprimary);
		color: black;
		font-size: 15px;
		font-family: sans-serif;
		transition: all 0.1s;
		border: 2px solid black;
	}

	.buttons input:checked {
		background: var(--banner);
		color: white;
		box-shadow: 0 1px 1px black;
		text-shadow: 0 2px 2px #808080;
	}

	.buttons input::before {
		content: attr(label);
		text-align: center;
	}
</style>
