<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<footer>
	<div class="footer-content">
		<div class="footer-section">
			<h3>Leadership</h3>
			<ul>
				<li>Miles Xing '26 (President)</li>
				<li>William Yoon '27 (Marketing Lead)</li>
				<li>Stella Luu '26 (Outreach Lead)</li>
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
		background-color: var(--color-footer-bg);
		color: var(--color-footer-text);
		padding: 4rem 1rem 2rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 2rem;
	}

	.footer-section {
		flex: 1 1 300px;
	}

	h3 {
		font-size: 1rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-footer-text);
		opacity: 0.9;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li,
	p {
		margin-bottom: 0.75rem;
		color: var(--color-footer-text);
		opacity: 0.8;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	a {
		color: var(--color-primary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	a:hover {
		color: var(--color-primary-dark);
		text-decoration: underline;
	}

	.contact-info {
		display: flex;
		align-items: center;
		margin-top: 1rem;
	}

	.footer-bottom {
		border-top: 1px solid var(--color-border);
		margin-top: 3rem;
		padding-top: 2rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-footer-text);
		opacity: 0.6;
	}

	.icons {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.icons a img {
		width: 24px;
		height: 24px;
		opacity: 0.8;
		transition: opacity 0.2s;
	}

	.icons a:hover img {
		opacity: 1;
	}

	@media screen and (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			gap: 3rem;
		}

		.footer-section {
			flex: 0;
			margin-bottom: 0;
		}

		footer {
			padding: 3rem 1rem 2rem;
		}
	}
</style>
