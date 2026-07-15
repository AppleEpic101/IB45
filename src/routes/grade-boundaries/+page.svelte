<script>
	import data from '$lib/assets/courses.json';
	import { fade, fly } from 'svelte/transition';

	let courses = [];
	for (let course in data) {
		if (course !== 'meta') {
			courses.push({ name: course, ...data[course] });
		}
	}

	const groups = data.meta.groups;
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="IB Grade Boundaries"
	description="View historical grade boundaries for every subject offered in the IB DP, at both SL and HL."
/>

<div class="body" in:fly={{ duration: 1000, y: 50 }}>
	<h1>Grade Boundaries</h1>

	<p class="intro">
		Explore historical grade boundaries for any IB DP subject, going back to M19 (May 2019).
	</p>

	<div in:fade={{ delay: 300, duration: 500 }} class="subject-groups">
		{#each { length: 6 } as _, i}
			<section class="group-section">
				<h3>{groups[i]}</h3>
				<div class="subject-grid">
					{#each courses as course}
						{#if course.name !== 'meta' && !course.isCore && course?.groupNumber?.includes(i + 1)}
							<a href="./grade-boundaries/{course.short}" class="subject-card">
								<span class="subject-title">
									{course.name}
									{#if course.groupNumber.length === 2}
										<span class="modifier-tag"
											>{course.groupNumber[1] === 's' ? ' (SBS)' : ' (*)'}</span
										>
									{/if}
								</span>
								<span class="view-btn">View →</span>
							</a>
						{/if}
					{/each}
				</div>
			</section>
		{/each}

		<section class="group-section">
			<h3>Core Requirements (EE & TOK)</h3>
			<div class="subject-grid">
				{#each courses as course}
					{#if course?.isCore}
						<a href="./grade-boundaries/{course.short}" class="subject-card">
							<span class="subject-title">{course.name}</span>
							<span class="view-btn">View →</span>
						</a>
					{/if}
				{/each}
			</div>
		</section>
	</div>

	<div class="legend">
		<p><strong>*</strong> = Interdisciplinary subject</p>
		<p><strong>SBS</strong> = School-based syllabus</p>
	</div>
</div>

<style lang="scss">
	.body {
		max-width: 1200px;
		margin: 0 auto;
		padding: 3rem 1.5rem;

		h1 {
			font-size: 3rem;
			font-weight: 800;
			letter-spacing: -0.03em;
			margin-bottom: 1rem;
			color: var(--color-text-main);
		}

		.intro {
			font-size: 1.125rem;
			color: var(--color-text-muted);
			max-width: 800px;
			line-height: 1.6;
			margin-bottom: 2rem;
		}
	}

	.group-section {
		margin-bottom: 4rem;

		h3 {
			font-size: 1.25rem;
			font-weight: 700;
			color: var(--color-text-main);
			margin-bottom: 1.5rem;
			padding-bottom: 0.75rem;
			border-bottom: 2px solid var(--color-surface-variant);
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}
	}

	.subject-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.subject-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 1.25rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-sm);
		text-decoration: none;

		&:hover {
			border-color: var(--color-primary);
			box-shadow: var(--shadow-md);
			transform: translateY(-2px);
		}
	}

	.subject-title {
		font-weight: 600;
		color: var(--color-text-main);
		font-size: 0.95rem;
		line-height: 1.4;

		.modifier-tag {
			color: var(--color-text-muted);
			font-size: 0.75rem;
			font-weight: 400;
		}
	}

	.view-btn {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.legend {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 0.875rem;

		p {
			margin: 0.25rem 0;
		}
	}

	@media (max-width: 600px) {
		.subject-grid {
			grid-template-columns: 1fr;
		}

		.body {
			padding: 2rem 1rem;
			h1 {
				font-size: 2rem;
			}
		}
	}
</style>