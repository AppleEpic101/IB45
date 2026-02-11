<script>
	import { fly, scale, fade } from 'svelte/transition';
	import Button from '$lib/components/button.svelte';
	import Message from '$lib/components/Message.svelte';

	import GradeBoundarySelector from '$lib/components/MainCalculator/GradeBoundarySelector.svelte';
	import MainCalculator from '$lib/components/MainCalculator/MainCalculator.svelte';
	import Footnote from '$lib/components/Footnote.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { subjects } from '$lib/data/subjects.js';
</script>

<PageHeader
	title={'IB Grade Calculator'}
	description={'Will YOU do well on your upcoming International Baccalaureate (IB) exams? Use this IB grade calculator to find out!'}
/>

<section class="hero">
	<div class="hero-background" />
	<div class="container" in:fade={{ duration: 800 }}>
		<div class="hero-content">
			<h1 in:fly={{ y: 20, duration: 800, delay: 200 }}>
				World #1 <span class="highlight">IB Predicted Score</span> Calculator
			</h1>
			<p class="subtitle" in:fly={{ y: 20, duration: 800, delay: 400 }}>
				The most accurate tool for the IB Diploma Program. Updated for {new Date().getFullYear()}.
			</p>
			<p class="stat-pill" in:fly={{ y: 20, duration: 800, delay: 500 }}>
				Trusted by 750,000+ students & teachers
			</p>
			<div class="last-updated" in:fly={{ y: 20, duration: 800, delay: 600 }}>
				<span class="dot" />
				Updated February 11, 2026
			</div>
		</div>
	</div>
</section>

<main class="container main-content">
	<div class="tools-section" in:fly={{ y: 50, duration: 800, delay: 200 }}>
		<div class="card tool-card">
			<h3>Boundary Selector</h3>
			<GradeBoundarySelector />
		</div>

		<div class="card tool-card highlight-tool">
			<h3>Diploma Score Calculator</h3>
			<MainCalculator />
		</div>
	</div>

	<div class="grid-section" in:fly={{ y: 50, duration: 800, delay: 400 }}>
		<div class="card calculator-card">
			<h3>Subject Calculators</h3>
			<p class="card-desc">Calculate grades for specific subjects.</p>
			<div class="pill-cloud">
				{#each subjects as subject}
					<Button href={subject.href} text={subject.text} />
				{/each}
				<Button href={'./subjects'} text={'View All Subjects →'} variant="primary" />
			</div>
		</div>
	</div>

	<div in:fly={{ y: 50, duration: 800, delay: 600 }}>
		<Message />
	</div>

	<div in:fly={{ y: 50, duration: 800, delay: 800 }}>
		<Footnote />
	</div>
</main>

<style lang="scss">
	.hero {
		position: relative;
		padding: 4rem 1rem 2rem;
		text-align: center;
		overflow: hidden;
		background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-gradient-end) 100%);
		border-bottom: 1px solid var(--color-border);
	}

	.hero-background {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, transparent 60%);
		animation: rotate 60s linear infinite;
		z-index: 0;
		pointer-events: none;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		position: relative;
		z-index: 1;
	}

	.hero-content h1 {
		font-size: clamp(2.5rem, 8vw, 3.5rem);
		line-height: 1.1;
		margin-bottom: 1.5rem;
		letter-spacing: -0.02em;
		font-weight: 800;
	}

	.highlight {
		color: var(--color-primary);
		background: -webkit-linear-gradient(45deg, var(--color-primary), var(--color-primary-dark));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		font-size: clamp(1rem, 4vw, 1.25rem);
		color: var(--color-text-muted);
		max-width: 700px;
		margin: 0 auto 2rem;
		line-height: 1.6;
	}

	.stat-pill {
		display: inline-block;
		padding: 0.5rem 1.25rem;
		background: rgba(14, 165, 233, 0.1);
		color: var(--color-primary-dark);
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.last-updated {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.dot {
		width: 8px;
		height: 8px;
		background-color: var(--color-success);
		border-radius: 50%;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: inherit;
			border-radius: 50%;
			animation: pulse 2s infinite;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(0.95);
			box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
		}
		70% {
			transform: scale(2);
			opacity: 0;
		}
		100% {
			transform: scale(0.95);
			opacity: 0;
		}
	}

	.main-content {
		padding: 3rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 2rem;
		box-shadow: var(--shadow-sm);
		transition: transform 0.3s ease, box-shadow 0.3s ease;

		@media (max-width: 600px) {
			padding: 1.5rem;
		}
	}

	.card:hover {
		box-shadow: var(--shadow-lg);
	}

	.grid-section {
		max-width: 1000px;
		margin: 0 auto;
		width: 100%;
	}

	.calculator-card h3 {
		margin-top: 0;
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.card-desc {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}

	.pill-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: flex-start;
	}

	.tools-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 1000px; /* narrowed for better vertical aesthetic */
		width: 100%;
		margin: 0 auto;
	}

	.tool-card h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--color-border);
		font-size: 1.25rem;
		font-weight: 700;
	}

	.highlight-tool {
		border-color: var(--color-primary);
		position: relative;
		border-top: 4px solid var(--color-primary);
	}

	@media (max-width: 768px) {
		.hero {
			padding: 3rem 1rem 1.5rem;
		}

		.main-content {
			padding: 2rem 1rem;
			gap: 2rem;
		}
	}
</style>
