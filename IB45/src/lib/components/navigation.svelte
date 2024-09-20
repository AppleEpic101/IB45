<script>
	import { fly } from 'svelte/transition';
</script>

<nav>
	<div class="nav-group">
		<a href="/">
			<div class="logo-group">
				<img id="img" src="/favicon.ico" alt="IB SCORE CALCULATOR" />
				<div class="logo-text">IB Predict</div>
			</div>
		</a>

		<div class="top-links">
			<a href="/">Home</a>
			<a href="/subjects">Subjects</a>
			<a href="/changelog">Changelog</a>
			<a href="/faq">FAQ</a>
		</div>
	</div>
</nav>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Space+Grotesk:wght@300..700&display=swap');
	$font-family: 'Space Grotesk', sans-serif;

	nav {
		background-color: var(--primary);
		justify-content: space-between;
		border-bottom: 1px solid black;
		.nav-group {
			display: flex;
			width: 950px;
			margin: 0 auto;

			.logo-group {
				display: flex;
				flex-direction: row;
				align-items: center;

				#img {
					width: 50px;
					margin: 5px 20px;
					transition: 0.3s ease-in-out;

					&:hover {
						transform: scale(1.05) rotate(360deg);
						-webkit-transform: scale(1.05) rotate(360deg);
						transition: transform 0.5s ease-in-out;
						-webkit-transition: -webkit-transform 0.5s ease-in-out;
					}
				}

				.logo-text {
					font-family: $font-family;
					font-size: 1.75em;
					white-space: nowrap;
					margin-right: 20px;
				}
			}
		}

		.top-links {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin-right: 5px;
			width: 100%;
			font-family: $font-family;
			a {
				padding: 10px;
				color: black;
				text-decoration: none;
				font-size: 1.2em;

				&:hover {
					background-color: var(--banner);
					color: white;
					transition: background-color 0.3s ease, color 0.3s ease;
				}
			}
		}

		@media screen and (max-width: 950px) {
			.nav-group {
				width: 100%;
			}
		}

		@media screen and (max-width: 600px) {
			.logo-text {
				display: none;
			}
		}

		@media screen and (max-width: 450px) {
			img {
				display: none;
			}

			.top-links {
				display: flex;
				justify-content: space-evenly;
				align-items: center;
				width: 100%;

				a {
					margin: 10px 0;
					font-size: 0.8em;
				}
			}
		}
	}
</style>
