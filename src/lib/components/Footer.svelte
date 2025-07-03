<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<footer>
	<div class="footer-content">
		<div class="footer-section">
			<h3>Maintainers</h3>
			<ul>
				<li>Alexander Du (Founder)</li>
				<li>Winston Thov</li>
				<li>David Yeo</li>
			</ul>
		</div>
		<div class="footer-section">
			<h3>CONTACT</h3>
			<p>Report errors, ask questions, etc.</p>
			<a href="mailto:admin@ibpredict.org">admin@ibpredict.org</a>
			<div class="contact-info">
				<Discord />
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		<p>&copy; {new Date().getFullYear()} IB Predict. All rights reserved.</p>
		<div class="icons">
			<a
				href="https://discord.gg/G8UvbTJHp8"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Discord"><img src="/icons/discord.png" alt="Discord" /></a
			>
			<a
				href="https://www.tiktok.com/@ibpredict.org"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="TikTok"><img src="/icons/tiktok.png" alt="TikTok" /></a
			>
			<a
				href="https://www.instagram.com/ibpredict/"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Instagram"><img src="/icons/instagram.png" alt="Instagram" /></a
			>
			<a
				href="https://github.com/AppleEpic101/IB45"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Github"><img src="/icons/github.png" alt="Github" /></a
			>
		</div>
	</div>
</footer>

<style>
	footer {
		background-color: #053f54;
		color: white;
		padding: 2rem 1rem;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.footer-section {
		flex: 1 1 300px;
		margin-bottom: 1.5rem;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li,
	p {
		margin-bottom: 0.5rem;
	}

	a {
		color: #90cdf4;
		text-decoration: none;
		transition: color 0.3s ease;
	}

	a:hover {
		color: #63b3ed;
	}

	.contact-info {
		display: flex;
		align-items: center;
		margin-top: 0.5rem;
	}

	.footer-bottom {
		border-top: 1px solid white;
		margin-top: 2rem;
		padding-top: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
	}

	.icons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.icons a img {
		width: 24px;
		height: 24px;
	}

	@media screen and (max-width: 768px) {
		.footer-content {
			flex-direction: column;
		}

		.footer-section {
			flex: 0;
			margin-bottom: 0;
		}
	}
</style>
