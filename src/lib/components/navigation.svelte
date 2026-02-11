<script>
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { darkMode } from '$lib/stores/stores.js';
	import { browser } from '$app/environment';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (browser) {
			document.body.style.overflow = isMenuOpen ? 'hidden' : '';
		}
	}

	function closeMenu() {
		isMenuOpen = false;
		if (browser) {
			document.body.style.overflow = '';
		}
	}

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/subjects', label: 'Subjects' },
		{ href: '/about', label: 'About' },
		{ href: '/changelog', label: 'Changelog' },
		{ href: '/faq', label: 'FAQ' }
	];
</script>

<nav>
	<div class="nav-container">
		<a href="/" class="logo-link" on:click={closeMenu}>
			<div class="logo-group">
				<img id="logo-img" src="/favicon.ico" alt="IB Predict Logo" />
				<div class="logo-text">IB Predict</div>
			</div>
		</a>

		<!-- Desktop Links -->
		<div class="desktop-links">
			{#each links as link}
				<a href={link.href}>{link.label}</a>
			{/each}
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

		<!-- Mobile Menu Button -->
		<button
			class="mobile-menu-btn"
			on:click={toggleMenu}
			aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
		>
			<div class="hamburger" class:open={isMenuOpen}>
				<span />
				<span />
				<span />
			</div>
		</button>
	</div>
</nav>

<!-- Mobile Drawer -->
{#if isMenuOpen}
	<div
		class="mobile-overlay"
		on:click={closeMenu}
		transition:fade={{ duration: 200 }}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && closeMenu()}
		aria-label="Close Menu Overlay"
	/>
	<div class="mobile-drawer" transition:fly={{ x: 300, duration: 300 }}>
		<div class="drawer-header">
			<div class="logo-text">Menu</div>
			<button class="close-drawer" on:click={closeMenu}>&times;</button>
		</div>

		<div class="drawer-links">
			{#each links as link}
				<a href={link.href} on:click={closeMenu}>{link.label}</a>
			{/each}
			<div class="drawer-footer">
				<button
					class="drawer-theme-toggle"
					on:click={() => {
						$darkMode = !$darkMode;
					}}
				>
					{#if $darkMode}
						Switch to Light Mode ☀️
					{:else}
						Switch to Dark Mode 🌙
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	nav {
		background-color: var(--color-surface-glass);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 1000;
		height: 70px;
		display: flex;
		align-items: center;

		.nav-container {
			max-width: 1200px;
			width: 100%;
			margin: 0 auto;
			padding: 0 1.5rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.logo-link {
				text-decoration: none;

				.logo-group {
					display: flex;
					align-items: center;
					gap: 0.75rem;

					#logo-img {
						width: 32px;
						height: 32px;
						transition: transform 0.5s ease;
					}

					&:hover #logo-img {
						transform: rotate(180deg);
					}

					.logo-text {
						font-family: var(--font-heading);
						font-size: 1.25rem;
						font-weight: 800;
						color: var(--color-text-main);
						letter-spacing: -0.02em;
					}
				}
			}
		}

		.desktop-links {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			@media (max-width: 900px) {
				display: none;
			}

			a {
				padding: 0.5rem 1rem;
				color: var(--color-text-muted);
				text-decoration: none;
				font-size: 0.95rem;
				font-weight: 600;
				border-radius: var(--radius-md);
				transition: all 0.2s ease;

				&:hover {
					background: var(--color-surface-variant);
					color: var(--color-primary);
				}
			}
		}

		.theme-toggle {
			background: var(--color-surface-variant);
			border: 1px solid var(--color-border);
			cursor: pointer;
			color: var(--color-text-muted);
			width: 40px;
			height: 40px;
			border-radius: var(--radius-md);
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s ease;
			margin-left: 0.5rem;

			&:hover {
				border-color: var(--color-primary);
				color: var(--color-primary);
			}
		}

		.mobile-menu-btn {
			display: none;
			background: none;
			border: none;
			cursor: pointer;
			padding: 0.5rem;
			z-index: 1001;

			@media (max-width: 900px) {
				display: block;
			}

			.hamburger {
				width: 24px;
				height: 18px;
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				span {
					display: block;
					width: 100%;
					height: 2px;
					background-color: var(--color-text-main);
					border-radius: 2px;
					transition: all 0.3s ease;
				}

				&.open {
					span:nth-child(1) {
						transform: translateY(8px) rotate(45deg);
					}
					span:nth-child(2) {
						opacity: 0;
					}
					span:nth-child(3) {
						transform: translateY(-8px) rotate(-45deg);
					}
				}
			}
		}
	}

	.mobile-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		z-index: 2000;
	}

	.mobile-drawer {
		position: fixed;
		top: 0;
		right: 0;
		width: 280px;
		height: 100%;
		background: var(--color-surface);
		z-index: 2001;
		box-shadow: var(--shadow-xl);
		display: flex;
		flex-direction: column;

		.drawer-header {
			padding: 1.5rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid var(--color-border);

			.logo-text {
				font-size: 1.25rem;
				font-weight: 800;
				color: var(--color-text-main);
			}

			.close-drawer {
				background: none;
				border: none;
				font-size: 2rem;
				color: var(--color-text-muted);
				cursor: pointer;
				line-height: 1;
			}
		}

		.drawer-links {
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			flex: 1;

			a {
				padding: 1rem;
				color: var(--color-text-main);
				text-decoration: none;
				font-weight: 600;
				border-radius: var(--radius-md);
				transition: all 0.2s ease;

				&:hover {
					background: var(--color-surface-variant);
					color: var(--color-primary);
				}
			}
		}

		.drawer-footer {
			margin-top: auto;
			padding: 1.5rem;
			border-top: 1px solid var(--color-border);

			.drawer-theme-toggle {
				width: 100%;
				padding: 1rem;
				background: var(--color-surface-variant);
				border: 1px solid var(--color-border);
				border-radius: var(--radius-md);
				color: var(--color-text-main);
				font-weight: 600;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					border-color: var(--color-primary);
				}
			}
		}
	}
</style>
