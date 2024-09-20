<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<div class="message">
	<div class="announcement">&#x1F440;Announcement&#x1F440;</div>
	<p>
		In anticipation for November 2024 and May 2025 examinations, I am currently working to implement
		additional features and insight tools. Please be patient as I work to improve the website. M24,
		if you have access to the M24 Grade Boundaries PDF, please email or DM it to me (contact below).
	</p>

	<Discord />
	<p>
		Please report all errors and concerns to <a href="mailto:admin@ibpredict.org"
			>admin@ibpredict.org</a
		>
		or <a href="https://discord.gg/G8UvbTJHp8">join the Discord Server.</a> Thank you and good luck to
		all N24 candidates!
	</p>
</div>

<style lang="scss">
	.message {
		border: 2px solid black;
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
