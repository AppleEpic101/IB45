<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<div class="message">
	<div class="announcement">Latest Announcements</div>
	<p>
		I have updated the site with the official November 2024 grade boundaries. As a general rule of
		thumb, November grade boundaries are usually higher than May grade boundaries, so M25 candidates
		should use the M24 boundaries for the most reliable predictions. Additionally, Timezone 2
		boundaries (Europe, Africa, Asia, Australia) are usually higher than Timezone 1 (North/South
		America).
	</p>
	<p>
		If you are interested in contributing to IB Predict, please contact me via email or DMs on
		Discord for more details. I will continue updating the site for the foreseeable future. I am
		grateful for the level of support this tool has received and hope it can continue to serve
		future IB candidates long into the future.
	</p>
	<p>Best of luck to all M25 candidates!</p>

	<p>
		Please report all errors and concerns to <a href="mailto:admin@ibpredict.org"
			>admin@ibpredict.org</a
		>
		or <a href="https://discord.gg/G8UvbTJHp8">join the Discord Server.</a>
	</p>
	<Discord />
</div>

<style lang="scss">
	.message {
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		border-radius: var(--radius-lg);
		padding: 2rem;
		margin-top: 1rem;
		text-align: left;
		box-shadow: var(--shadow-sm);

		.announcement {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 1rem;
			font-weight: 700;
			margin-bottom: 1.25rem;
			color: var(--color-primary);
			text-transform: uppercase;
			letter-spacing: 0.05em;

			&::before {
				content: '';
				display: block;
				width: 4px;
				height: 20px;
				background: var(--color-primary);
				border-radius: var(--radius-full);
			}
		}

		p {
			line-height: 1.7;
			margin-bottom: 1.25rem;
			color: var(--color-text-muted);
			font-size: 0.95rem;
		}

		p:last-of-type {
			margin-bottom: 0;
			padding-top: 1.25rem;
			border-top: 1px solid var(--color-border);
		}

		a {
			color: var(--color-primary);
			font-weight: 600;
			transition: opacity 0.2s;
		}

		a:hover {
			opacity: 0.8;
			text-decoration: underline;
		}
	}
</style>
