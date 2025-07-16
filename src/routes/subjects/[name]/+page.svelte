<script>
	import { fade, fly, scale } from 'svelte/transition';
	import Slider from '$lib/components/slider.svelte';
	import Links from '$lib/components/links.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import BoundaryTable from '$lib/components/subject/boundaryTable.svelte';
	import CoreTable from '$lib/components/subject/coreTable.svelte';
	import CoreMatrix from '$lib/components/subject/coreMatrix.svelte';
	import Bargraph from '$lib/components/subject/bargraph.svelte';
	import GradeGraph from '$lib/components/subject/GradeGraph.svelte';
	import Collapsible2 from '$lib/components/Collapsible2.svelte';
	import Excel from '$lib/components/subject/Excel.svelte';
	import Footnote from '$lib/components/Footnote.svelte';
	import GlobalBulletin from '$lib/components/subject/GlobalBulletin.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { onMount } from 'svelte';

	import BackButton from '$lib/components/subject/BackButton.svelte';
	import SubjectHeader from '$lib/components/subject/SubjectHeader.svelte';
	import Syllabus from '$lib/components/subject/Syllabus.svelte';
	import GradeCalculator from '$lib/components/subject/GradeCalculator.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { getAllBoundaries, calculateGrade } from '$lib/group.js';

	export let data;
	export let version = data.version;
	const datas = [data.data, ...data.data.old];

	$: syllabus = datas.find((a) => a.firstAssessment == version);

	let showBulletin = true;
	const languages = data.info.lang;
	const classical = data.info.classical;

	// get language from query parameters
	let language;
	export let langQuery = data.langQuery;
	// let langQuery = $page.url.searchParams.get('lang');
	if (data.data.name === 'Classical Language') {
		language = classical.includes(langQuery) ? langQuery : 'Latin';
	} else if (data.data.isLang) {
		language = languages.includes(langQuery) ? langQuery : 'English';
	}

	// get level from query parameters
	export let level = data.level;
	$: s = level === 'HL' ? syllabus.HL : syllabus.SL;

	$: name = data.data.isLang ? language + ' ' + data.data.name : data.data.name;

	// gets all previous grade boundaries (for table display)
	let lastSL;
	let lastHL;

	$: SLResults = data.data.isLang
		? getAllBoundaries(data.data.name, language).SL
		: getAllBoundaries(data.data.name).SL;
	$: HLResults = data.data.isLang
		? getAllBoundaries(data.data.name, language).HL
		: getAllBoundaries(data.data.name).HL;

	// gets the latest grade boundary (for awarded mark calculation)
	$: SLoptions = SLResults.filter((obj) => obj.short === 'M24' || obj.short === 'N24');
	$: HLoptions = HLResults.filter((obj) => obj.short === 'M24' || obj.short === 'N24');

	const init = async () => {
		if (SLoptions && HLoptions) {
			lastSL = SLoptions?.find(
				(obj) => obj.short === 'M24' && (obj.timezone === 0 || obj.timezone === 1)
			);

			lastHL = HLoptions?.find(
				(obj) => obj.short === 'M24' && (obj.timezone === 0 || obj.timezone === 1)
			);

			if (!lastSL) lastSL = SLoptions?.find((obj) => obj.short === 'M24');
			if (!lastSL) lastSL = SLoptions?.find((obj) => obj.short === 'N24');
			if (!lastSL) lastSL = SLoptions[SLoptions.length - 1];

			if (!lastHL) lastHL = HLoptions?.find((obj) => obj.short === 'M24');
			if (!lastHL) lastHL = HLoptions?.find((obj) => obj.short === 'N24');
			if (!lastHL) lastHL = HLoptions[HLoptions.length - 1];
		}
	};

	$: language && init();

	onMount(() => {
		init();
	});

	// calculate weighted average (percentage out of 100)
	let weight = [];
	let marks = [];
	let assessments = [];
	$: {
		weight = s?.map((a) => a.weight);
		marks = s?.map((a) => a.maxMarks);
	}
	$: grade = calculateGrade(assessments, marks, weight, data.data.name);

	// update url with new query parameters
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
			updateUrl('syl', version && version !== data.data.firstAssessment, version);
			go();
		}
	}
</script>

<PageHeader
	title={`IB ${language || ''} ${data.data.name} Grade Calculator`}
	description={`Calculate your IB ${data.data.name} grade! See historical grade boundary data, course descriptions, and more.`}
/>

<div class="body" in:fly={{ duration: 1400, x: 200 }}>
	<BackButton />

	<SubjectHeader {syllabus} />
	<Links />

	{#if syllabus.name === 'Creativity, Activity, Service'}
		<Collapsible2 title="Description" content={syllabus.description} />
	{/if}

	<Syllabus data={data.data} bind:version />

	{#if syllabus.name !== 'Creativity, Activity, Service'}
		<GradeCalculator
			data={data.data}
			{syllabus}
			{s}
			{grade}
			{language}
			bind:level
			{HLResults}
			{SLResults}
			{lastSL}
			{lastHL}
			{SLoptions}
			{HLoptions}
			bind:assessments
			{classical}
			{languages}
		/>
	{/if}

	{#if syllabus.name !== 'Creativity, Activity, Service'}
		<h4>Graphs</h4>

		<!-- {#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge' && syllabus.name !== 'Creativity, Activity, Service' && showBulletin}
				<div class="graph">
					<GlobalBulletin {mark} name={level + ' ' + name} bind:showBulletin />
				</div>
			{/if} -->

		<div class="graph">
			<Bargraph name={syllabus.name} {level} {SLResults} {HLResults} {grade} />
		</div>

		<div class="grade">
			<h4 in:fly={{ delay: 400, duration: 1000, x: 200 }}>Historical Grade Boundaries</h4>
			{#if data.data.SLOnly}
				<h5 in:fly={{ delay: 400, duration: 1000, x: 200 }}>
					{syllabus.name} is offered only at the SL level
				</h5>
			{/if}
			{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge'}
				{#if !data.data.SLOnly}
					<ToggleSelect
						identifier="e"
						arr={['SL', 'HL']}
						arrVal={['SL', 'HL']}
						bind:value={level}
					/>
				{/if}
			{/if}
			<div class="dropdown">
				{#if data.data.isLang && syllabus.name === 'Classical Language'}
					<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
						<Dropdown arr={classical} bind:value={language} />
					</div>
				{:else if data.data.isLang}
					<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
						<Dropdown arr={languages} bind:value={language} />
					</div>
				{/if}
			</div>

			<GradeGraph name={syllabus.name} {level} {language} {SLResults} {HLResults} {grade} />

			<div class="tables">
				{#if syllabus.name === 'Theory Of Knowledge' || syllabus.name === 'Extended Essay'}
					<CoreTable {name} res={SLResults} />
					<CoreMatrix name={syllabus.name} />
				{:else}
					<BoundaryTable name={'SL ' + name} res={SLResults} />
					{#if !data.data.SLOnly}
						<BoundaryTable name={'HL ' + name} res={HLResults} />
					{/if}
				{/if}
			</div>
			{#if !data.data.isCore}
				<div class="excel">
					<Excel
						assessments={s}
						name={syllabus.name}
						{level}
						{language}
						{SLResults}
						{HLResults}
						firstAssessment={data.data.firstAssessment}
					/>
				</div>{/if}
			<Footnote />
		</div>
	{/if}
</div>

<style>
	.body {
		width: 1100px;
		margin: 10px auto;
		padding-bottom: 20px;
	}

	@media screen and (max-width: 1100px) {
		.body {
			margin: 10px 10px;
			width: calc(100% - 50px);
		}
	}

	.tables {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
		margin-top: 10px;
	}

	.excel {
		display: flex;
		justify-content: center;
	}

	.wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	label {
		position: relative;
		display: inline-block;
		text-align: center;
	}

	.dropdown {
		display: flex;
		justify-content: center;
	}

	input[type='radio'] {
		position: absolute;
		visibility: hidden;
	}

	input[type='radio']:checked + div {
		background-color: #053f54;
	}
	input[type='radio']:checked + div > span {
		color: white;
		text-shadow: 0 2px 2px #808080;
	}

	.graph {
		margin: 0 auto 80px auto;
		height: 35vh;
		max-width: 75vh;
	}

	@media screen and (max-width: 800px) {
		.description {
			font-size: small;
		}
	}

	@media screen and (max-width: 500px) {
		h1 {
			font-size: 1.3em;
		}
		.body {
			margin: 0 10px;
		}
		.tables {
			flex-direction: column;
			align-items: center;
		}
		.description {
			font-size: x-small;
		}
	}
</style>
