<script>
	export let selectedGroup6;

	function resetStorage() {
		localStorage.removeItem('name6');
		localStorage.removeItem('level6');
		localStorage.removeItem('language6');
		localStorage.removeItem('sliderPosition6');
	}
</script>

<form>
	<div class="option">
		<input type="radio" bind:group={selectedGroup6} value="6" on:click={resetStorage} />
		<label for="group6">Group 6</label>
	</div>
	<div class="option">
		<input type="radio" bind:group={selectedGroup6} value="1" on:click={resetStorage} />
		<label for="group1">Group 1</label>
	</div>
	<div class="option">
		<input type="radio" bind:group={selectedGroup6} value="2" on:click={resetStorage} />
		<label for="group2">Group 2</label>
	</div>
	<div class="option">
		<input type="radio" bind:group={selectedGroup6} value="3" on:click={resetStorage} />
		<label for="group3">Group 3</label>
	</div>
	<div class="option">
		<input type="radio" bind:group={selectedGroup6} value="4" on:click={resetStorage} />
		<label for="group4">Group 4</label>
	</div>
</form>
