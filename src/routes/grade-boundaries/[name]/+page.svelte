<script>
	import { fly } from 'svelte/transition';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import BoundaryTable from '$lib/components/subject/boundaryTable.svelte';
	import CoreTable from '$lib/components/subject/coreTable.svelte';
	import CoreMatrix from '$lib/components/subject/coreMatrix.svelte';
	import GradeGraph from '$lib/components/subject/GradeGraph.svelte';
	import GradeCalculator from '$lib/components/subject/GradeCalculator.svelte';
	import Footnote from '$lib/components/Footnote.svelte';

	import { page } from '$app/stores';
	import { getAllBoundaries } from '$lib/utils/boundaries.js';
	import { calculateGrade } from '$lib/utils/grades.js';

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
	$: syllabus = data.data;
	$: assessmentsForLevel = level === 'HL' ? syllabus.HL : syllabus.SL;

	$: name = data.data.isLang ? language + ' ' + data.data.name : data.data.name;

	$: SLResults = data.data.isLang
		? getAllBoundaries(data.data.name, language).SL
		: getAllBoundaries(data.data.name).SL;
	$: HLResults = data.data.isLang
		? getAllBoundaries(data.data.name, language).HL
		: getAllBoundaries(data.data.name).HL;

	// The calculator uses the newest available sessions for the selected language.
	$: SLoptions = SLResults.filter((result) => result.short === 'M25' || result.short === 'N25');
	$: HLoptions = HLResults.filter((result) => result.short === 'M25' || result.short === 'N25');
	$: if (SLoptions.length === 0) SLoptions = SLResults;
	$: if (HLoptions.length === 0) HLoptions = HLResults;

	const preferredBoundary = (options) =>
		options.find((result) => result.short === 'M25' && result.timezone === 1) ||
		options.find((result) => result.short === 'M25') ||
		options.find((result) => result.short === 'N25') ||
		options[options.length - 1];

	let lastSL;
	let lastHL;
	$: if (!SLoptions.includes(lastSL)) lastSL = preferredBoundary(SLoptions);
	$: if (!HLoptions.includes(lastHL)) lastHL = preferredBoundary(HLoptions);

	let assessments = [];
	$: weights = assessmentsForLevel?.map((assessment) => assessment.weight) || [];
	$: maximumMarks = assessmentsForLevel?.map((assessment) => assessment.maxMarks) || [];
	$: grade = calculateGrade(assessments, maximumMarks, weights, data.data.name);
	let mark;
	let marksToIncrease;
	let showGradeGraphs = true;

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

	<h4 class="page-title">Grade Calculator &amp; Historical Boundaries</h4>
	<h1 class="subject-title" class:hl={level === 'HL'}>
		{#if !isCore}{level} {/if}{name}
	</h1>

	{#if data.data.SLOnly}
		<h5>{data.data.name} is offered only at the SL level</h5>
	{/if}

	{#if data.data.name !== 'Creativity, Activity, Service'}
		<section class="calculator-section" aria-labelledby="calculator-heading">
			<div class="section-heading">
				<p>Estimate your result</p>
				<h2 id="calculator-heading">Grade calculator</h2>
			</div>
			<GradeCalculator
				data={data.data}
				{syllabus}
				s={assessmentsForLevel}
				{grade}
				bind:language
				bind:level
				{HLResults}
				{SLResults}
				{lastSL}
				{lastHL}
				{SLoptions}
				{HLoptions}
				bind:mark
				{marksToIncrease}
				bind:assessments
				bind:showGradeGraphs
				{classical}
				{languages}
			/>
		</section>
	{/if}

	<section class="history-section" aria-labelledby="history-heading">
		<div class="section-heading">
			<p>Compare exam sessions</p>
			<h2 id="history-heading">Historical grade boundaries</h2>
		</div>

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

		{#if !isCore && showGradeGraphs}
			<div class="graph">
				<GradeGraph name={data.data.name} {level} {language} {SLResults} {HLResults} />
			</div>
		{/if}

		<div class="tables">
			{#if isCore}
				<CoreTable {name} res={SLResults} />
				<CoreMatrix name={data.data.name} />
			{:else}
				<BoundaryTable name={'SL ' + name} res={SLResults} />
				{#if !data.data.SLOnly}
					<BoundaryTable name={'HL ' + name} res={HLResults} />
				{/if}
			{/if}
		</div>

		<Footnote />
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

	.page-title {
		color: var(--color-text-muted);
		font-weight: 600;
		margin-bottom: 0.25rem;
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

	.calculator-section,
	.history-section {
		margin-top: 2.5rem;
	}

	.calculator-section {
		padding-bottom: 2.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.section-heading {
		margin-bottom: 1.25rem;

		p {
			margin: 0 0 0.25rem;
			color: var(--color-text-muted);
			font-size: 0.8rem;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
		}

		h2 {
			margin: 0;
			color: var(--color-text-main);
			font-size: 1.5rem;
		}
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
