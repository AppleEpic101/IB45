<script>
	import Discord from '$lib/components/Discord.svelte';
</script>

<footer>
	<div class="footer-content">
		<div class="footer-section">
			<h3>THE SYNDICATE</h3>
			<ul>
				<li>Alexander Du (Founder)</li>
				<li>Richard Yang</li>
				<li>Winston Thov</li>
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
		<p>&copy; {new Date().getFullYear()} THE SYNDICATE. All rights reserved.</p>
	</div>
</footer>

<style>
	footer {
		background-color: var(--banner);
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
