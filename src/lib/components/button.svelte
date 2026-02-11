<script>
	export let href;
	export let text;
	export let variant;
</script>

<a {href}><button class={['subject', variant].join(' ')}>{text}</button></a>

<style>
	.subject {
		margin: 5px;
		background-color: var(--color-surface);
		padding: 0.75rem 1.25rem;
		border-radius: var(--radius-full);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-sm);
		text-decoration: none;
		font-size: 1rem;
		font-weight: 500;
		font-family: var(--font-body);
		color: var(--color-text-main);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		display: inline-block;
	}

	.subject:hover {
		cursor: pointer;
		background-color: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.subject:active {
		transform: translateY(0);
	}

	.subject.primary {
		background-color: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	.subject.primary:hover {
		background-color: var(--color-primary-dark);
		border-color: var(--color-primary-dark);
	}

	.subject.larger {
		font-size: 1.25em;
		padding: 1rem 1.75rem;
	}
</style>
