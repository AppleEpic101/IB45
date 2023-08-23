<script>
	import { selectedGroup6 } from '$lib/stores/store.js';
	import Dropdown from '$lib/components/dropdown.svelte';

	const msg = ['Group 6 (Default)', 'Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'];
	const i = ['6', '1', '2', '3', '4', '5'];

	function resetStorage() {
		store = { name: '', level: '', language: '', region: '', sliderPosition: [] };
	}

	// $: {
	// 	$selectedGroup6 && resetStorage();
	// }
</script>

<!-- <Dropdown
	arr={['Group 6 (Default)', 'Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5']}
	arrVal={['6', '1', '2', '3', '4', '5']}
	bind:value={$selectedGroup6}
/> -->
<!-- <div class="body">
	<p>
		If you are replacing your Group 6 selection with a subject from Groups 1-5, please mark the
		appropriate group.
	</p>
	<form>
		{#each { length: msg.length } as _, j}
			<div class="option">
				<input type="radio" bind:group={$selectedGroup6} value={i[j]} on:click={resetStorage} />
				<label>{msg[j]}</label>
			</div>
		{/each}
	</form>
</div> -->
