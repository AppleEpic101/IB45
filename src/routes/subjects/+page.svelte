<script>
	import data from '$lib/assets/courses.json';
	import { fade, fly, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	let courses = [];
	for (let course in data) {
		if (course !== 'meta') {
			courses.push({ name: course, ...data[course] });
		}
	}

	const groups = data.meta.groups;
	import Discord from '$lib/components/Discord.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Button from '../../lib/components/button.svelte';
</script>

<PageHeader
	title="IB DP Subject List"
	description="View all the subjects offered in the IB DP. Click to calculate your IB grade for an individual subject."
/>

<div class="body" in:fly={{ duration: 1000, y: 50 }}>
	<h1>Explore IB Subjects</h1>

	<p class="intro">Calculate your predicted grade for any IB DP subject.</p>

	<div in:fade={{ delay: 300, duration: 500 }} class="subject-groups">
		{#each { length: 6 } as _, i}
			<section class="group-section">
				<h3>{groups[i]}</h3>
				<div class="subject-grid">
					{#each courses as course}
						{#if course.name !== 'meta' && !course.isCore && course?.groupNumber?.includes(i + 1)}
							<div class="subject-card">
								<span class="subject-title">
									{course.name}
									{#if course.groupNumber.length === 2}
										<span class="modifier-tag"
											>{course.groupNumber[1] === 's' ? ' (SBS)' : ' (*)'}</span
										>
									{/if}
								</span>
								<div class="level-selector">
									<a href="./subjects/{course.short}?lvl=SL" class="lvl-btn sl">SL</a>
									{#if !course.SLOnly}
										<a href="./subjects/{course.short}?lvl=HL" class="lvl-btn hl">HL</a>
									{/if}
								</div>
							</div>
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
						<div class="subject-card">
							<span class="subject-title">{course.name}</span>
							<div class="level-selector">
								<a href="./subjects/{course.short}?lvl=SL" class="lvl-btn sl">Start Calculation</a>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</section>

		<section class="group-section">
			<h3>M2025 Science Updates</h3>
			<div class="subject-grid">
				{#each ['physics', 'chemistry', 'biology'] as slug}
					{@const course = courses.find((c) => c.short === slug)}
					{#if course}
						<div class="subject-card">
							<span class="subject-title">{course.name} (2025)</span>
							<div class="level-selector">
								<a href="./subjects/{slug}?lvl=SL&syl=2025" class="lvl-btn sl">SL</a>
								<a href="./subjects/{slug}?lvl=HL&syl=2025" class="lvl-btn hl">HL</a>
							</div>
						</div>
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

		.discord-wrapper {
			margin-bottom: 3rem;
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
		position: relative;

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

	.level-selector {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	.lvl-btn {
		text-decoration: none;
		font-size: 0.85rem;
		font-weight: 700;
		padding: 6px 14px;
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
		border: 1px solid transparent;
		position: relative;
		z-index: 2;

		&.sl {
			background: rgba(14, 165, 233, 0.1);
			color: #0ea5e9;
			border-color: rgba(14, 165, 233, 0.2);

			&::after {
				content: '';
				position: absolute;
				top: -1.25rem;
				bottom: -1.25rem;
				left: -20rem; /* Cover the whole card title area */
				right: -1.5rem;
				z-index: 1;
			}

			&:hover {
				background: #0ea5e9;
				color: white;
				border-color: #0ea5e9;
			}
		}

		&.hl {
			background: rgba(249, 115, 22, 0.1);
			color: #f97316;
			border-color: rgba(249, 115, 22, 0.2);

			&:hover {
				background: #f97316;
				color: white;
				border-color: #f97316;
			}
		}
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
