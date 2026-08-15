<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	export let data;
	const { post } = data;
</script>

<PageHeader title={post.meta.title} description={post.meta.description} />

<article class="main-content">
	<header class="post-header">
		<span>IB Predict research</span>
		<h1>{post.meta.title}</h1>
		<p>{post.meta.description}</p>
	</header>
	<!-- Local Markdown files are the only content source for this rendered HTML. -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div>{@html post.content}</div>
</article>

<style lang="scss">
	.main-content {
		max-width: 780px;
		padding: 12px 24px 64px;
		margin: 0 auto;
		color: var(--color-text-main);
		line-height: 1.7;

		:global(h2) {
			margin: 2rem 0 0.5rem;
			font-size: 1.35rem;
		}

		:global(p),
		:global(li) {
			color: var(--color-text-muted);
		}

		:global(strong) {
			color: var(--color-text-main);
		}
	}

	.post-header {
		padding-bottom: 24px;
		margin-bottom: 24px;
		border-bottom: 1px solid var(--color-border);

		span {
			color: var(--color-primary);
			font-size: 0.75rem;
			font-weight: 800;
			letter-spacing: 0.06em;
			text-transform: uppercase;
		}

		h1 {
			margin: 8px 0;
			font-size: clamp(2rem, 5vw, 3.5rem);
			line-height: 1.05;
		}

		p {
			margin: 0;
			color: var(--color-text-muted);
			font-size: 1rem;
		}
	}

	@media screen and (max-width: 800px) {
		:global(iframe) {
			height: 600px;
		}
	}
	@media screen and (max-width: 600px) {
		.main-content {
			padding: 8px 16px 48px;
		}

		:global(iframe) {
			height: 400px;
		}
	}
</style>
