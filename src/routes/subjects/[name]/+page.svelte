<script>
	import { fly } from 'svelte/transition';
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

	import SubjectHeader from '$lib/components/subject/SubjectHeader.svelte';
	import Syllabus from '$lib/components/subject/Syllabus.svelte';
	import GradeCalculator from '$lib/components/subject/GradeCalculator.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import BulletinTable from '$lib/components/subject/BulletinTable.svelte';

	import { page } from '$app/stores';
	import { getAllBoundaries } from '$lib/utils/boundaries.js';
	import { calculateGrade } from '$lib/utils/grades.js';

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
	$: selectedTableLevel = data.data.SLOnly ? 'SL' : level;
	$: selectedBoundaryResults = selectedTableLevel === 'HL' ? HLResults : SLResults;

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
	$: SLoptions = SLResults.filter((obj) => obj.short === 'M25' || obj.short === 'N25');
	$: HLoptions = HLResults.filter((obj) => obj.short === 'M25' || obj.short === 'N25');

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

			if (!lastSL) lastSL = SLoptions?.find((obj) => obj.short === 'M25');
			if (!lastSL) lastSL = SLoptions?.find((obj) => obj.short === 'N25');
			if (!lastSL) lastSL = SLoptions[SLoptions.length - 1];

			if (!lastHL) lastHL = HLoptions?.find((obj) => obj.short === 'M25');
			if (!lastHL) lastHL = HLoptions?.find((obj) => obj.short === 'N25');
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

<div class="body" class:theme-hl={level === 'HL'} in:fly={{ duration: 1400, x: 200 }}>
	<SubjectHeader {syllabus} {level} {language} />

	{#if syllabus.name === 'Creativity, Activity, Service'}
		<Collapsible2 title="Description" content={syllabus.description} />
	{/if}

	{#if Banners[data.data.name] && !data.data.isCore}
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
			<section class="bulletin-panel" aria-label="Global grade distribution and data table">
				<GlobalBulletin {mark} name={level + ' ' + name} bind:showBulletin embedded />

				<div class="bulletin-table">
					<BulletinTable name={level + ' ' + name} />
				</div>
			</section>
		{/if}

		{#if showGradeGraphs}
			<div class="graph">
				<Bargraph name={syllabus.name} {level} {SLResults} {HLResults} {grade} />
			</div>
		{/if}

		<section class="grade" aria-labelledby="historical-boundaries-title">
			<header class="grade-header">
				<div>
					<h4 id="historical-boundaries-title">Historical Grade Boundaries</h4>
					<p>Compare official grade thresholds across examination sessions.</p>
				</div>
				<div class="grade-controls">
					{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge'}
						{#if !data.data.SLOnly}
							<div class="grade-control">
								<span>Level</span>
								<ToggleSelect
									identifier="e"
									arr={['SL', 'HL']}
									arrVal={['SL', 'HL']}
									bind:value={level}
								/>
							</div>
						{/if}
					{/if}
					{#if data.data.isLang}
						<div class="grade-control">
							<span>Language</span>
							{#if syllabus.name === 'Classical Language'}
								<Dropdown arr={classical} bind:value={language} />
							{:else}
								<Dropdown arr={languages} bind:value={language} />
							{/if}
						</div>
					{/if}
				</div>
			</header>
			{#if data.data.SLOnly}
				<h5>
					{syllabus.name} is offered only at the SL level
				</h5>
			{/if}

			{#if showGradeGraphs}
				<GradeGraph name={syllabus.name} {level} {language} {SLResults} {HLResults} {grade} />
			{/if}
			<div class="tables">
				{#if syllabus.name === 'Theory Of Knowledge' || syllabus.name === 'Extended Essay'}
					<CoreTable {name} res={SLResults} />
					<CoreMatrix name={syllabus.name} />
				{:else}
					<div class="table-intro">
						<div>
							<span class="active-level">{selectedTableLevel} selected</span>
							<h5>{selectedTableLevel} boundary history</h5>
						</div>
						<p>
							Average shows the typical boundary. Standard deviation shows how much it has varied.
						</p>
					</div>
					<BoundaryTable name={selectedTableLevel + ' ' + name} res={selectedBoundaryResults} />
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
		</section>
	{/if}
</div>

<style lang="scss">
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

		&.theme-hl {
			--color-primary: #f97316;
			--color-primary-dark: #ea580c;
			--color-surface-variant: #fff7ed;

			:global([data-theme='dark']) & {
				--color-primary: #fb923c;
				--color-primary-dark: #f97316;
				--color-surface-variant: #2d1d1a;
			}
		}
	}

	@media screen and (max-width: 1100px) {
		.body {
			margin: 10px 10px;
			width: calc(100% - 50px);
		}
	}

	.tables {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		margin-top: 22px;
		padding-top: 20px;
		border-top: 1px solid var(--color-border);
	}

	.table-intro {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 12px;

		h5,
		p {
			margin: 0;
		}

		h5 {
			margin-top: 5px;
			color: var(--color-text-main);
			font-size: 1rem;
		}

		p {
			max-width: 460px;
			color: var(--color-text-muted);
			font-size: 0.78rem;
			text-align: right;
		}
	}

	.active-level {
		display: inline-flex;
		padding: 4px 7px;
		border: 1px solid color-mix(in srgb, var(--color-primary) 45%, var(--color-border));
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
		color: var(--color-primary);
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.bulletin-panel {
		margin: 24px 0 36px;
		padding: 22px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.bulletin-table {
		margin-top: 22px;
		padding-top: 20px;
		border-top: 1px solid var(--color-border);
	}

	.excel {
		display: flex;
		justify-content: center;
	}

	.graph {
		margin: 20px auto 40px auto;
		max-width: 75vh;
	}

	.grade {
		margin: 28px 0 0;
		padding: 22px;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.grade-header {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 18px;
		padding-bottom: 18px;
		border-bottom: 1px solid var(--color-border);

		h4,
		p {
			margin: 0;
		}

		h4 {
			color: var(--color-text-main);
			font-size: 1.35rem;
		}

		p {
			margin-top: 4px;
			color: var(--color-text-muted);
			font-size: 0.86rem;
		}
	}

	.grade-controls {
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: 12px;
	}

	.grade-control {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 5px;

		> span {
			color: var(--color-text-muted);
			font-size: 0.68rem;
			font-weight: 800;
			letter-spacing: 0.06em;
			text-transform: uppercase;
		}
	}

	@media screen and (max-width: 500px) {
		.body {
			margin: 0 10px;
		}
		.tables {
			flex-direction: column;
			align-items: stretch;
		}
		.table-intro {
			align-items: flex-start;
			flex-direction: column;

			p {
				text-align: left;
			}
		}
		.bulletin-panel {
			padding: 14px;
		}
		.grade {
			padding: 14px;
		}
		.grade-header {
			align-items: flex-start;
			flex-direction: column;
		}
		.grade-controls {
			justify-content: flex-start;
			width: 100%;
		}
	}
</style>
