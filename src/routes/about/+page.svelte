<script>
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Discord from '$lib/components/Discord.svelte';
	import { fly, fade } from 'svelte/transition';

	let cofounders = [
		{
			name: 'Alex Du',
			title: 'Co-founder',
			gradYear: "'25",
			photo: '/placeholder.png',
			linkedin: ''
		},
		{
			name: 'Winston Thov',
			title: 'Co-founder',
			gradYear: "'25",
			photo: '/placeholder.png',
			linkedin: 'https://www.linkedin.com/in/winston-thov-2209a120b/'
		}
	];

	let leadership = [
		{
			name: 'Miles Xing',
			title: 'President',
			gradYear: "'26",
			photo: '/placeholder.png',
			linkedin: ''
		},
		{
			name: 'William Yoon',
			title: 'Marketing Lead',
			gradYear: "'27",
			photo: '/placeholder.png',
			linkedin: ''
		},
		{
			name: 'Stella Luu',
			title: 'Outreach Lead',
			gradYear: "'26",
			photo: '/placeholder.png',
			linkedin: ''
		}
	];

	let maintainers = [
		{
			name: 'Daksh Gupta',
			title: 'Maintainer',
			gradYear: "'25",
			photo: '/placeholder.png',
			linkedin: ''
		},
		{
			name: 'Krishna Sridhar',
			title: 'Maintainer',
			gradYear: "'27",
			photo: '/placeholder.png',
			linkedin: ''
		}
	];

	let pastMaintainers = [
		{
			name: 'David Yeo',
			title: 'Past Maintainer',
			gradYear: "'25",
			photo: '/placeholder.png',
			linkedin: ''
		}
	];
</script>

<PageHeader
	title="About IB Predict"
	description="Supporting teachers, coordinators, and candidates worldwide since 2023."
/>

<div class="body-container">
	<section class="mission-section" in:fly={{ y: 30, duration: 800 }}>
		<div class="card mission-card">
			<div class="mission-grid">
				<div class="mission-text">
					<h2>Our Mission</h2>
					<p>
						Founded in June 2023 as a CAS project by a group of first-year IB students at Interlake
						High School in Bellevue, Washington. IB Predict™ was created with one goal: to support
						teachers, coordinators, and candidates in navigating the IB Diploma Program.
					</p>
					<p>
						Since its launch, <strong>750,000+ people</strong> from over
						<strong>150+ countries</strong>
						worldwide have visited the platform.
					</p>
					<p>
						If you are a student at Interlake High School and are interested in contributing, reach
						out to leadership. This project will continue to be maintained and developed by
						Interlake students.
					</p>
					<div class="stats-badge">
						<span>Global Impact: 150+ Countries</span>
						<span class="dot" />
						<span>750k+ Users</span>
					</div>
				</div>
				<div class="mission-image">
					<img src="/Interlake-High-School.jpg" alt="Interlake High School" />
				</div>
			</div>
		</div>
	</section>

	<section class="team-section" in:fly={{ y: 30, duration: 800, delay: 200 }}>
		<div class="section-header">
			<h2>Meet Our Team</h2>
		</div>

		<div class="team-categories">
			<div class="category-group">
				<h3>Co-Founders</h3>
				<div class="team-grid">
					{#each cofounders as member, i}
						<div class="member-card" in:fade={{ delay: 400 + i * 100 }}>
							<div class="photo-wrapper">
								<img src={member.photo} alt={member.name} class="member-photo" />
								<a href={member.linkedin} target="_blank" class="linkedin-overlay">
									<img src="/icons/linkedin.png" alt="LinkedIn" />
								</a>
							</div>
							<div class="member-info">
								<div class="member-name">{member.name}</div>
								<div class="member-title">
									{member.title}
									<span class="grad-year">{member.gradYear}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="category-group">
				<h3>Leadership</h3>
				<div class="team-grid">
					{#each leadership as member, i}
						<div class="member-card" in:fade={{ delay: 500 + i * 100 }}>
							<div class="photo-wrapper">
								<img src={member.photo} alt={member.name} class="member-photo" />
								<a href={member.linkedin} target="_blank" class="linkedin-overlay">
									<img src="/icons/linkedin.png" alt="LinkedIn" />
								</a>
							</div>
							<div class="member-info">
								<div class="member-name">{member.name}</div>
								<div class="member-title">
									{member.title}
									<span class="grad-year">{member.gradYear}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="category-group">
				<h3>Maintainers</h3>
				<div class="team-grid">
					{#each maintainers as member, i}
						<div class="member-card" in:fade={{ delay: 600 + i * 100 }}>
							<div class="photo-wrapper">
								<img src={member.photo} alt={member.name} class="member-photo" />
								<a href={member.linkedin} target="_blank" class="linkedin-overlay">
									<img src="/icons/linkedin.png" alt="LinkedIn" />
								</a>
							</div>
							<div class="member-info">
								<div class="member-name">{member.name}</div>
								<div class="member-title">
									{member.title}
									<span class="grad-year">{member.gradYear}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<div class="category-group">
				<h3>Past Maintainers</h3>
				<div class="team-grid">
					{#each pastMaintainers as member, i}
						<div class="member-card" in:fade={{ delay: 700 + i * 100 }}>
							<div class="photo-wrapper">
								<img src={member.photo} alt={member.name} class="member-photo" />
								<a href={member.linkedin} target="_blank" class="linkedin-overlay">
									<img src="/icons/linkedin.png" alt="LinkedIn" />
								</a>
							</div>
							<div class="member-info">
								<div class="member-name">{member.name}</div>
								<div class="member-title">
									{member.title}
									<span class="grad-year">{member.gradYear}</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>

<style lang="scss">
	.body-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 5rem;
	}

	.card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 3rem;
		box-shadow: var(--shadow-sm);
	}

	.mission-card {
		overflow: hidden;

		.mission-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 3rem;
			align-items: center;
		}

		h2 {
			font-size: 2.5rem;
			font-weight: 800;
			letter-spacing: -0.02em;
			margin-bottom: 2rem;
			background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
			-webkit-background-clip: text;
			background-clip: text;
			-webkit-text-fill-color: transparent;
		}

		p {
			font-size: 1.125rem;
			line-height: 1.8;
			color: var(--color-text-main);
			margin-bottom: 1.5rem;
			opacity: 0.9;
		}

		.stats-badge {
			display: inline-flex;
			align-items: center;
			gap: 1rem;
			background: var(--color-surface-variant);
			padding: 0.75rem 1.5rem;
			border-radius: var(--radius-full);
			font-weight: 600;
			font-size: 0.875rem;
			color: var(--color-primary-dark);
			margin-top: 1rem;

			.dot {
				width: 4px;
				height: 4px;
				background: currentColor;
				border-radius: 50%;
				opacity: 0.5;
			}
		}

		.mission-image {
			position: relative;
			height: 100%;
			min-height: 300px;
			border-radius: var(--radius-md);
			overflow: hidden;
			box-shadow: var(--shadow-md);

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				display: block;
			}
		}
	}

	.section-header {
		text-align: center;
		margin-bottom: 3.5rem;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;

		h2 {
			font-size: 2.25rem;
			font-weight: 800;
			margin-bottom: 1.5rem;
		}
	}

	.team-categories {
		display: flex;
		flex-direction: column;
		gap: 6rem;
	}

	.category-group {
		h3 {
			font-size: 1.75rem;
			font-weight: 800;
			margin-bottom: 2.5rem;
			text-align: center;
			color: var(--color-text-main);
			position: relative;
			padding-bottom: 1rem;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
				width: 60px;
				height: 4px;
				background: var(--color-primary);
				border-radius: var(--radius-full);
				opacity: 0.3;
			}
		}
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 2.5rem;
	}

	.member-card {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;

		.photo-wrapper {
			position: relative;
			width: 160px;
			height: 160px;
			margin-bottom: 1.5rem;
			border-radius: 50%;
			overflow: hidden;
			border: 4px solid var(--color-surface);
			box-shadow: var(--shadow-md);
			transition: transform 0.3s ease;

			&:hover {
				transform: scale(1.05);

				.linkedin-overlay {
					opacity: 1;
				}
			}
		}

		.member-photo {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.linkedin-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(14, 165, 233, 0.6);
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 0;
			transition: opacity 0.3s ease;

			img {
				width: 32px;
				height: 32px;
				filter: brightness(0) invert(1);
			}
		}

		.member-name {
			font-size: 1.125rem;
			font-weight: 700;
			color: var(--color-text-main);
			margin-bottom: 0.25rem;
		}

		.member-title {
			font-size: 0.875rem;
			color: var(--color-text-muted);
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.5rem;

			.grad-year {
				font-size: 0.75rem;
				font-weight: 700;
				color: var(--color-primary);
				background: var(--color-surface-variant);
				padding: 2px 6px;
				border-radius: 4px;
				opacity: 0.8;
			}
		}
	}

	@media (max-width: 900px) {
		.mission-card {
			.mission-grid {
				grid-template-columns: 1fr;
				gap: 2.5rem;
			}

			.mission-image {
				order: -1;
				min-height: 250px;
			}
		}
	}

	@media (max-width: 600px) {
		.body-container {
			padding: 2rem 1rem;
		}

		.mission-card {
			padding: 2rem;
			h2 {
				font-size: 1.75rem;
			}
		}
	}
</style>
