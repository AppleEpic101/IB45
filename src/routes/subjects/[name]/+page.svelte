<script>
	import { fade, fly, scale } from 'svelte/transition';
	import Slider from '$lib/components/slider.svelte';
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
	import BulletinTable from '$lib/components/subject/BulletinTable.svelte';

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { getAllBoundaries, calculateGrade } from '$lib/group.js';

	import Banners from '$lib/assets/banners.json';

	export let data;
	export let version = data.version;
	const datas = [data.data, ...data.data.old];

	$: syllabus = datas.find((a) => a.firstAssessment == version);

	let showBulletin = true;
	let showGradeGraphs = true;

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

	$: {
		if (SLoptions.length === 0) {
			SLoptions = SLResults;
		}
		if (HLoptions.length === 0) {
			HLoptions = HLResults;
		}
	}

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
	let mark, marksToIncrease;

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

	<SubjectHeader {syllabus} {level} />

	{#if syllabus.name === 'Creativity, Activity, Service'}
		<Collapsible2 title="Description" content={syllabus.description} />
	{/if}

	{#if Banners[data.data.name]}
		<img class="banner" src={Banners[data.data.name].banner} alt="" />
	{/if}

	<Syllabus data={data.data} bind:version />

	{#if syllabus.name !== 'Creativity, Activity, Service'}
		<GradeCalculator
			data={data.data}
			{syllabus}
			{s}
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
	{/if}

	{#if syllabus.name !== 'Creativity, Activity, Service'}
		{#if !data.data.isCore}
			<h4>Grade Distributions</h4>

			<GlobalBulletin {mark} name={level + ' ' + name} bind:showBulletin />

			<div class="tables">
				<BulletinTable name={level + ' ' + name} />
			</div>
		{/if}

		{#if showGradeGraphs}
			<h4>Historical Probability Distribution</h4>

			<div class="graph">
				<Bargraph name={syllabus.name} {level} {SLResults} {HLResults} {grade} />
			</div>
		{/if}

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

			{#if showGradeGraphs}
				<GradeGraph name={syllabus.name} {level} {language} {SLResults} {HLResults} {grade} />
			{/if}
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
	.banner {
		display: flex;
		justify-content: center;
		margin: 10px auto;
		width: 600px;
	}

	@media screen and (max-width: 600px) {
		.banner {
			width: 100%;
		}
	}
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

	.graph {
		margin: 0 auto 80px auto;
		height: 35vh;
		max-width: 75vh;
	}

	.dropdown {
		display: flex;
		justify-content: center;
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
