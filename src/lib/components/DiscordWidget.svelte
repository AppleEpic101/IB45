<script>
	import { showDiscord } from '$lib/stores/stores.js';
	let isVisible = true;

	function closeWidget() {
		// Hide the widget and update the store
		isVisible = false;
		showDiscord.set(false);
	}
</script>

{#if isVisible}
	<div class="widget">
		<button class="close-button" on:click={closeWidget}>×</button>
		<div class="content">
			<strong>Join us on Discord!</strong><br />
			<a href="https://discord.gg/G8UvbTJHp8" target="_blank">Click here to connect</a>
		</div>
		<img src="/icons/discord.png" alt="Discord" width="50" height="50" />
	</div>
{/if}

<style>
	.widget {
		display: flex;
		justify-content: space-evenly;
		position: fixed;
		bottom: 20px;
		right: 20px;
		background-color: #1c1f3c;
		color: white;
		border-radius: 12px;
		padding: 16px 8px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
		width: 260px;
		z-index: 1000;
	}

	.close-button {
		position: absolute;
		top: 8px;
		right: 10px;
		background: transparent;
		border: none;
		color: white;
		font-size: 18px;
		cursor: pointer;
	}

	.content a {
		color: white;
		text-decoration: underline;
	}

	.content a:hover {
		text-decoration: none;
	}
</style>
