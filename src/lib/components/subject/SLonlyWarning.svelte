<script>
	export let data;
	export let syllabus;
</script>

{#if data.SLOnly}
	<h5>
		{syllabus.name} is offered only at the SL level
	</h5>
{/if}
