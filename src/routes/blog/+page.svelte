<script>
	import Links from '$lib/components/links.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	export let data;
	const { posts } = data;
</script>

<PageHeader
	title={'Blog'}
	description={'Read blogs on IB news, grade boundary reports, and more...'}
/>
<h1 in:fly={{ delay: 100, duration: 1300, x: 200 }}>Blog</h1>
<Links />
<div class="main-content" in:fly={{ delay: 100, duration: 1300, x: 200 }}>
	<div class="paragraph-text">
		Occasionally, I will write about IB, whether it's expressing my personal opinions or sharing and
		analyzing IB data. Generally, I will post the Grade Boundary PDFs here as soon as I receive
		them. Have a good read!
	</div>

	{#each posts as post}
		<a href={`/blog/${post.slug}`}>
			<article>
				<h2>{post.meta.title}</h2>
				<!-- Link to dynamic route -->
				<p>{post.meta.description}</p>
				<!-- <small>{post.meta.date}</small> -->
			</article></a
		>
	{/each}
</div>

<style lang="scss">
	.main-content {
		padding-bottom: 20px;
		margin: 10px 18%;
	}
	.paragraph-text {
		margin: 20px 0;
	}
	h1 {
		margin: 20px 18%;
	}
	ul {
		list-style: none;
	}
	li::before {
		content: '• ';
	}

	article {
		border: 1px solid var(--bordercolor);
		padding: 10px;
		margin: 10px 0;
		h2 {
			margin: 0;
		}
	}
	@media screen and (max-width: 480px) {
		.main-content {
			margin: 0 10px;
		}
		h1 {
			margin: 10px;
		}
	}
</style>
