<script>
	export let data;
	export let version;
</script>

<h4>Past Syllabuses</h4>
<button
	class="btn btn-sik"
	on:click={() => {
		version = data.firstAssessment;
	}}>Current ({data.firstAssessment})</button
>
{#if data.old}
	{#each data.old as old}
		<button
			class="btn btn-sik"
			on:click={() => {
				version = old.firstAssessment;
			}}>{old.firstAssessment}-{old.lastAssessment}</button
		>
	{/each}
{/if}
