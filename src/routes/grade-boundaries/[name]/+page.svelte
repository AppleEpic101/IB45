<script>
	import { fly } from 'svelte/transition';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import BoundaryTable from '$lib/components/subject/boundaryTable.svelte';
	import CoreTable from '$lib/components/subject/coreTable.svelte';
	import CoreMatrix from '$lib/components/subject/coreMatrix.svelte';
	import GradeGraph from '$lib/components/subject/GradeGraph.svelte';

	import { page } from '$app/stores';
	import { getAllBoundaries } from '$lib/utils/boundaries.js';

	export let data;

	const languages = data.info.lang;
	const classical = data.info.classical;
	const isCore = data.data.name === 'Extended Essay' || data.data.name === 'Theory Of Knowledge';

	// language (only relevant for language subjects)
	let language;
	export let langQuery = data.langQuery;
	if (data.data.name === 'Classical Language') {
		language = classical.includes(langQuery) ? langQuery : 'Latin';
	} else if (data.data.isLang) {
		language = languages.includes(langQuery) ? langQuery : 'English';
	}

	// SL / HL toggle
	export let level = data.level;

	$: name = data.data.isLang ? language + ' ' + data.data.name : data.data.name;

	$: SLResults = data.data.isLang
		? getAllBoundaries(data.data.name, language).SL
		: getAllBoundaries(data.data.name).SL;
	$: HLResults = data.data.isLang
		? getAllBoundaries(data.data.name, language).HL
		: getAllBoundaries(data.data.name).HL;

	// keep ?lvl= and ?lang= in the URL so links are shareable
	const newUrl = new URL($page.url);
	const updateUrl = (param, condition, value) => {
		if (condition) {
			newUrl?.searchParams?.set(param, value);
		} else {
			newUrl?.searchParams?.delete(param);
		}
	};

	const go = () => {
		if (newUrl?.searchParams?.toString()) {
			history.replaceState({}, '', `?${newUrl.searchParams.toString()}`);
		} else {
			history.replaceState({}, '', `${$page.url.pathname}`);
		}
	};

	$: {
		if (typeof window !== 'undefined') {
			updateUrl('lang', data.data.isLang, language);
			updateUrl('lvl', level === 'HL' && !data.data.isCore, 'HL');
			go();
		}
	}
</script>

<PageHeader
	title={`IB ${data.data.name} Grade Boundaries`}
	description={`Historical IB grade boundaries for ${data.data.name}, going back to M19.`}
/>

<div class="body" class:hl={level === 'HL'} in:fly={{ duration: 1000, x: 200 }}>
	<a href="/grade-boundaries" class="back">← Back to all subjects</a>

	<h1 class="subject-title" class:hl={level === 'HL'}>
		{#if !isCore}{level} {/if}{name} Grade Boundaries
	</h1>

	{#if data.data.SLOnly}
		<h5>{data.data.name} is offered only at the SL level</h5>
	{/if}

	<section class="history-section" aria-label="Historical grade boundaries">
		<div class="controls">
			{#if !isCore && !data.data.SLOnly}
				<ToggleSelect identifier="e" arr={['SL', 'HL']} arrVal={['SL', 'HL']} bind:value={level} />
			{/if}

			{#if data.data.isLang && data.data.name === 'Classical Language'}
				<Dropdown arr={classical} bind:value={language} />
			{:else if data.data.isLang}
				<Dropdown arr={languages} bind:value={language} />
			{/if}
		</div>

		{#if !isCore}
			<div class="graph">
				<GradeGraph name={data.data.name} {level} {language} {SLResults} {HLResults} />
			</div>
		{/if}

		<div class="tables">
			{#if isCore}
				<CoreTable {name} res={SLResults} />
				<CoreMatrix name={data.data.name} />
			{:else}
				<BoundaryTable name={`${level} ${name}`} res={level === 'HL' ? HLResults : SLResults} />
			{/if}
		</div>
	</section>
</div>

<style lang="scss">
	.body {
		width: 1100px;
		margin: 10px auto;
		padding-bottom: 40px;

		&.hl {
			--color-primary: #f97316;
			--color-primary-dark: #ea580c;
		}
	}

	@media screen and (max-width: 1100px) {
		.body {
			margin: 10px 10px;
			width: calc(100% - 50px);
		}
	}

	.back {
		display: inline-block;
		margin-bottom: 1.5rem;
		color: var(--color-text-muted);
		text-decoration: none;
		font-weight: 600;

		&:hover {
			color: var(--color-primary);
		}
	}

	.subject-title {
		color: var(--color-primary);
		font-size: 2rem;
		font-weight: 800;
		margin-top: 0;
		margin-bottom: 1.5rem;
	}

	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.history-section {
		margin-top: 1.5rem;
	}

	.graph {
		margin: 20px auto 40px auto;
		max-width: 75vh;
	}

	.tables {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
		margin-top: 10px;
		margin-bottom: 1.5rem;
	}

	@media screen and (max-width: 500px) {
		.body {
			margin: 0 10px;
		}
		.tables {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
