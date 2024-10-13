<script>
	import { onMount } from 'svelte';
	export let title;
	export let content;
	let isCollapsed = false;

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	onMount(() => {
		if (window && window.innerWidth < 700) {
			isCollapsed = true;
		} else {
			isCollapsed = false;
		}
	});
</script>

<div class="collapsible">
	<div class="collapsible-header" on:click={toggleCollapse}>
		<h4>{title}</h4>
		<span class="arrow" class:is-collapsed={isCollapsed} />
	</div>
	{#if !isCollapsed}
		<div class="collapsible-content">
			{content}
		</div>
	{/if}
</div>

<style>
	.collapsible {
		margin-bottom: 10px;
	}
	.collapsible-header {
		cursor: pointer;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.arrow {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
		transform: rotate(45deg);
		transition: transform 0.3s ease;
	}
	.is-collapsed {
		transform: rotate(135deg);
	}
	.collapsible-content {
		overflow: hidden;
	}
</style>
