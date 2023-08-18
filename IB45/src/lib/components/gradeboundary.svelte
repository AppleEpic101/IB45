<script>
	import { gradeBoundary, gradeBoundaryData } from '$lib/stores/store.js';
	import M19 from '$lib/assets/Grade_BoundariesM19';
	import M22 from '$lib/assets/Grade_BoundariesM22';
	import N22 from '$lib/assets/Grade_BoundariesN22';

	$: {
		if ($gradeBoundary === 'M19') {
			$gradeBoundaryData = Object.keys(M19).map((courseName) => ({
				name: courseName,
				TZ: M19[courseName].TZ
			}));
		} else if ($gradeBoundary === 'M22') {
			$gradeBoundaryData = Object.keys(M22).map((courseName) => ({
				name: courseName,
				TZ: M22[courseName].TZ
			}));
		} else {
			$gradeBoundaryData = Object.keys(N22).map((courseName) => ({
				name: courseName,
				TZ: N22[courseName].TZ
			}));
		}
	}
</script>

<div class="body">
	<p>Select the grade boundary.</p>

	<form>
		<div class="option">
			<input type="radio" bind:group={$gradeBoundary} value="M19" />
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>May 2019</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={$gradeBoundary} value="M22" />
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>May 2022 (Default)</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={$gradeBoundary} value="N22" />
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label>November 2022</label>
		</div>
	</form>
</div>
