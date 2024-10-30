<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<div class="message">
	<div class="announcement">&#x1F440;Announcement&#x1F440;</div>
	<p>
		I have updated the site with the official May 2024 grade boundaries. The M24 largely reflects
		the same grade boundaries as M23, meaning everything is back to normal. I have added graphs to
		the subject pages to help everyone visualize the changing grade boundaries better. November
		grade boundaries are usually higher than May grade boundaries, so N24 candidates should use the N23 boundaries for the most reliable predictions.
	</p>
	<p>
		I will continue updating the site for forseeable future. I hope this tool will continue to be
		useful for future IB candidates. Good luck to all N24 candidates!
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
