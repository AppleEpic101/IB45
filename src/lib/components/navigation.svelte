<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { darkMode } from '$lib/stores/stores.js';

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
			<a href="/about">About</a>
			<a href="/changelog">Changelog</a>
			<a href="/faq">FAQ</a>
			<button
				class="theme-toggle"
				on:click={() => ($darkMode = !$darkMode)}
				aria-label="Toggle Dark Mode"
			>
				{#if $darkMode}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line
							x1="12"
							y1="21"
							x2="12"
							y2="23"
						/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line
							x1="18.36"
							y1="18.36"
							x2="19.78"
							y2="19.78"
						/><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line
							x1="4.22"
							y1="19.78"
							x2="5.64"
							y2="18.36"
						/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg
					>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg
					>
				{/if}
			</button>
		</div>
		<div class="dropdown">
			<button class="menu-btn" on:click={toggleDropdown} aria-label="Menu">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="feather feather-menu"
					><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line
						x1="3"
						y1="18"
						x2="21"
						y2="18"
					/></svg
				>
			</button>

			{#if dropdownOpen}
				<div
					class="dropdown-content"
					bind:this={dropdownElement}
					transition:fly={{ y: -5, duration: 200 }}
				>
					<a href="/" on:click={toggleDropdown}>Home</a>
					<a href="/subjects" on:click={toggleDropdown}>Subjects</a>
					<a href="/about" on:click={toggleDropdown}>About</a>
					<a href="/changelog" on:click={toggleDropdown}>Changelog</a>
					<a href="/faq" on:click={toggleDropdown}>FAQ</a>
					<button
						class="mobile-theme-toggle"
						on:click={() => {
							$darkMode = !$darkMode;
							toggleDropdown();
						}}
					>
						{#if $darkMode}
							Light Mode ☀️
						{:else}
							Dark Mode 🌙
						{/if}
					</button>
				</div>
			{/if}
		</div>
	</div>
</nav>

<style lang="scss">
	.dropdown {
		display: none;
		position: relative;

		&:hover {
			cursor: pointer;
		}

		.dropdown-content {
			position: absolute;
			background-color: var(--color-surface);
			min-width: 180px;
			box-shadow: var(--shadow-lg);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-md);
			z-index: 101;
			top: 50px;
			right: 0;
			overflow: hidden;

			a {
				color: var(--color-text-main);
				padding: 12px 16px;
				text-decoration: none;
				display: block;
				font-family: var(--font-body);

				&:hover {
					background-color: var(--color-bg);
					color: var(--color-primary);
				}
			}
		}

		.menu-btn {
			cursor: pointer;
			background: none;
			border: none;
			padding: 0;
			display: flex;
			align-items: center;
			color: var(--color-text-main);
		}

		.mobile-theme-toggle {
			cursor: pointer;
			background: none;
			border: none;
			padding: 12px 16px;
			display: block;
			text-align: left;
			width: 100%;
			color: var(--color-text-main);
			font-family: var(--font-body);
			font-size: 1rem;
			font-weight: 500;

			&:hover {
				background-color: var(--color-bg);
				color: var(--color-primary);
			}
		}
	}

	nav {
		background-color: var(--color-surface-glass);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		opacity: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--color-border);
		padding: 0px;
		position: sticky;
		top: 0;
		z-index: 100;
		transition: all 0.3s ease;

		.nav-group {
			display: flex;
			max-width: 1200px;
			width: 100%;
			margin: auto;
			padding: 0 1rem;
			justify-content: space-between;
			align-items: center;
			height: 70px; /* fixed height for consistency */

			.logo-group {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 1rem;

				#img {
					width: 40px;
					height: 40px;
					transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

					&:hover {
						transform: rotate(180deg);
					}
				}

				.logo-text {
					font-family: var(--font-heading);
					font-size: 1.5rem;
					white-space: nowrap;
					font-weight: 700;
					color: var(--color-text-main);
					letter-spacing: -0.02em;
				}
			}
		}

		.top-links {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			a {
				padding: 0.5rem 1rem;
				color: var(--color-text-muted);
				text-decoration: none;
				font-size: 1rem;
				font-weight: 500;
				border-radius: var(--radius-md);
				font-family: var(--font-body);
				transition: all 0.2s ease;

				&:hover {
					background-color: rgba(14, 165, 233, 0.1);
					color: var(--color-primary-dark);
				}
			}
		}

		.theme-toggle {
			background: none;
			border: none;
			cursor: pointer;
			color: var(--color-text-muted);
			padding: 0.5rem;
			border-radius: var(--radius-md);
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s ease;

			&:hover {
				background-color: rgba(14, 165, 233, 0.1);
				color: var(--color-primary-dark);
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
		}

		.nav-group .logo-group .logo-text {
			font-size: 1.25rem;
		}
	}
</style>
