<script>
	import { selectedGroup6 } from '$lib/stores/store.js';
	import Dropdown from '$lib/components/dropdown.svelte';
</script>

<Dropdown
	arr={['Group 6 (Default)', 'Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5']}
	arrVal={['6', '1', '2', '3', '4', '5']}
	bind:value={$selectedGroup6}
/>
