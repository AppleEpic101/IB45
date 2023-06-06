<script>
	export let gradeBoundary;
	
</script>

<div class="body">
	<p>Select the grade boundary.</p>

	<form>
		<div class="option">
			<input type="radio" bind:group={gradeBoundary} value="M22" />
			<label for="May 2022">May 2022</label>
		</div>
		<div class="option">
			<input type="radio" bind:group={gradeBoundary} value="N22" />
			<label for="November 2022">November 2022</label>
		</div>
	</form>
</div>
