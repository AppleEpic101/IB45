<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let dropdownOpen = false;
	let dropdownElement;

	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}

	function handleClickOutside(event) {
		if (
			dropdownElement &&
			!dropdownElement.contains(event.target) &&
			!event.target.closest('.dropdown')
		) {
			dropdownOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
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
			<a href="/blog">Blog</a>
			<a href="/changelog">Changelog</a>
			<a href="/faq">FAQ</a>
		</div>
		<div class="dropdown">
			<img src="/menu.png" width="25" alt="Menu" on:click={toggleDropdown} />

			{#if dropdownOpen}
				<div
					class="dropdown-content"
					bind:this={dropdownElement}
					transition:fly={{ y: -5, duration: 200 }}
				>
					<a href="/" on:click={toggleDropdown}>Home</a>
					<a href="/subjects" on:click={toggleDropdown}>Subjects</a>
					<a href="/blog" on:click={toggleDropdown}>Blog</a>
					<a href="/changelog" on:click={toggleDropdown}>Changelog</a>
					<a href="/faq" on:click={toggleDropdown}>FAQ</a>
				</div>
			{/if}
		</div>
	</div>
</nav>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@300&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

	.dropdown {
		display: none;
		position: relative;

		&:hover {
			cursor: pointer;
		}

		.dropdown-content {
			position: absolute;
			background-color: #f9f9f9;
			min-width: 160px;
			box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
			z-index: 1;
			top: 40px;
			right: 0;

			a {
				color: black;
				padding: 12px 16px;
				text-decoration: none;
				display: block;

				&:hover {
					background-color: #f1f1f196;
				}
			}
		}

		.menu-icon {
			cursor: pointer;
		}
	}

	nav {
		background-color: #1e3a8a;
		opacity: 0.95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1.5px solid black;
		padding: 0px;
		position: sticky;
		top: 0;
		z-index: 100;

		.nav-group {
			display: flex;
			width: 1150px;
			margin: auto;
			justify-content: space-between;
			align-items: center;
			min-height: 100%;

			.logo-group {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin: 10px auto;

				#img {
					width: 40px;
					margin: 0px 20px;
					transition: 0.3s ease-in-out;

					&:hover {
						transform: scale(1.05) rotate(360deg);
						-webkit-transform: scale(1.05) rotate(360deg);
						transition: transform 0.5s ease-in-out;
						-webkit-transition: -webkit-transform 0.5s ease-in-out;
					}
				}

				.logo-text {
					font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;
					font-size: 1.75em;
					white-space: nowrap;
					margin-right: 20px;
					color: white;
				}
			}
		}

		.top-links {
			display: flex;
			align-items: flex-end;
			margin-right: 5px;
			font-family: 'Montserrat', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif;

			a {
				height: 100%;
				padding: 18px 10px;
				color: white;
				text-decoration: none;
				font-size: 1.2em;

				&:hover {
					background-color: #053f54;
					color: white;
					transition: background-color 0.3s ease, color 0.3s ease;
				}
			}
		}
		@media screen and (max-width: 600px) {
			.top-links {
				display: none;
			}
		}
	}

	@media screen and (max-width: 950px) {
		.nav-group {
			width: 100%;
		}
	}

	@media screen and (max-width: 600px) {
		.top-links {
			display: none;
		}

		.dropdown {
			display: flex;
			align-items: center;
			margin-right: 10px;
		}

		.logo-text {
			font-size: 1.5em;
		}

		nav {
			padding: 0;
		}
		#img {
			width: 10px;
		}
	}
</style>
