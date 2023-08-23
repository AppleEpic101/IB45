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
	<p>Select the grade boundary.</p>
	<form>
		{#each { length: gradeBoundaries.length } as _, i}
			<div class="option">
				<input type="radio" bind:group={$gradeBoundary} value={'' + str[i]} />
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label
					>{gradeBoundaries[i]['info'].name}
					{#if i == 4} (Default) {/if}</label
				>
			</div>
		{/each}
	</form>
</div>
