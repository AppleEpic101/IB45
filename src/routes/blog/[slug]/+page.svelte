<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	export let data;
	const { post } = data;
</script>

<PageHeader title={post.meta.title} description={post.meta.description} />

<article class="main-content">
	<div>{@html post.content}</div>
</article>

<style>
	.main-content {
		padding-bottom: 20px;
		margin: 10px 18%;
	}

	@media screen and (max-width: 800px) {
		:global(iframe) {
			height: 600px;
		}
	}
	@media screen and (max-width: 600px) {
		.main-content {
			margin: 0 10px;
		}

		:global(iframe) {
			height: 400px;
		}
	}
</style>
