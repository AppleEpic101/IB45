<script>
	import { selectedGroup6 } from "$lib/stores/store.js";

	function resetStorage() {
		localStorage.removeItem('name6');
		localStorage.removeItem('level6');
		localStorage.removeItem('language6');
		localStorage.removeItem('sliderPosition6');
	}
</script>

<div class="body">
	<p>
		If you are replacing your Group 6 selection with a subject from Groups 1-4, please mark the
		appropriate group.
	</p>

	<form>
		<div class="option">
			<input type="radio" bind:group={$selectedGroup6} value="6" on:click={resetStorage} />
			<label for="group6">Group 6 (Default)</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={$selectedGroup6} value="1" on:click={resetStorage} />
			<label for="group1">Group 1</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={$selectedGroup6} value="2" on:click={resetStorage} />
			<label for="group2">Group 2</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={$selectedGroup6} value="3" on:click={resetStorage} />
			<label for="group3">Group 3</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={$selectedGroup6} value="4" on:click={resetStorage} />
			<label for="group4">Group 4</label>
		</div>
	</form>
</div>
