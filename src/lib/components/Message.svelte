<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<div class="message">
	<div class="announcement">&#x1F440;Announcement&#x1F440;</div>
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
		border: 2px solid #1e3a8a;
		border-radius: 10px;
		padding: 0 20px;

		.announcement {
			font-size: 1.2em;
			text-align: center;
			font-weight: bold;
			margin: 10px 0 0 0;
		}

		p {
			line-height: 1.3;
		}
	}
</style>
