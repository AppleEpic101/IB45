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

	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import {
		calculateNormalResults,
		calculateCoreResults,
		getAllBoundaries,
		calculateGrade
	} from '$lib/group.js';

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

	// calculate awarded mark
	let mark, str, marksToIncrease;
	$: {
		if (data.data.isCore) {
			mark = calculateCoreResults(grade, lastSL?.tz);
			const gradeMap = {
				E: 1,
				D: 2,
				C: 3,
				B: 4,
				A: 5
			};
			marksToIncrease = lastSL?.tz[gradeMap[mark]] - grade;
			str = 'Using the ' + lastSL?.fullName + ' grade boundary';
		} else {
			if (level === 'HL') {
				mark = calculateNormalResults(grade, lastHL?.tz);
				marksToIncrease = lastHL?.tz[mark] - grade;
				str = 'Using the ' + lastHL?.fullName + ' grade boundary';
			} else {
				mark = calculateNormalResults(grade, lastSL?.tz);
				marksToIncrease = lastSL?.tz[mark] - grade;
				str = 'Using the ' + lastSL?.fullName + ' grade boundary';
			}
		}

		// boundary not found
		if (
			(level === 'SL' && SLResults.length === 0 && !data.data.isCore) ||
			(level === 'HL' && HLResults.length === 0 && !data.data.isCore)
		) {
			str = 'No grade boundary data available';
			mark = 'N/A';
		}
	}

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
	<a href="/subjects">
		<button class="btn btn-sik">back</button>
	</a>

	<div>
		<h1>
			{syllabus.name}
			({syllabus.firstAssessment})
		</h1>

		<h4>
			{#if syllabus.groupNumber.length === 2}
				{#if syllabus.groupNumber[1] === 's'}
					Group {syllabus.groupNumber[0]} school-based syllabus subject <br />
				{:else}
					Group {syllabus.groupNumber[0]} and {syllabus.groupNumber[1]} interdisciplinary subject<br
					/>
				{/if}
			{:else if syllabus.groupNumber[0] === 99}
				Core subject <br />
			{:else if syllabus.groupNumber.length === 1}
				Group {syllabus.groupNumber} subject <br />
			{/if}
			Assessments from {syllabus.firstAssessment} to {syllabus.lastAssessment}
		</h4>
	</div>
	<Links />

	{#if syllabus.name === 'Creativity, Activity, Service'}
		<Collapsible2 title="Description" content={syllabus.description} />
	{/if}
	<h4>Past Syllabuses</h4>
	<button
		class="btn btn-sik"
		on:click={() => {
			version = data.data.firstAssessment;
		}}>Current ({data.data.firstAssessment})</button
	>
	{#if data.data.old}
		{#each data.data.old as old}
			<button
				class="btn btn-sik"
				on:click={() => {
					version = old.firstAssessment;
				}}>{old.firstAssessment}-{old.lastAssessment}</button
			>
		{/each}
	{/if}

	<div>
		{#if syllabus.name !== 'Creativity, Activity, Service'}
			<h4>Grade Calculator</h4>
			{#if data.data.SLOnly}
				<h5>
					{syllabus.name} is offered only at the SL level
				</h5>
			{/if}
			<div class="dropdown">
				{#if data.data.isLang && syllabus.name === 'Classical Language'}
					<div>
						<Dropdown arr={classical} bind:value={language} />
					</div>
				{:else if data.data.isLang}
					<div>
						<Dropdown arr={languages} bind:value={language} />
					</div>
				{/if}
			</div>
			{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge'}
				{#if !data.data.SLOnly}
					<div class="wrap">
						<label>
							<input type="radio" name="ef" value={'SL'} bind:group={level} />
							<div class="btn btn-sik"><span>SL</span></div>
						</label>
						<label>
							<input type="radio" name="ef" value={'HL'} bind:group={level} />
							<div class="btn btn-sik"><span>HL</span></div>
						</label>
					</div>
				{/if}
			{/if}
			<div class="wrap">
				{#if level === 'HL'}
					{#each HLoptions as tz}
						<label>
							<input type="radio" name="f" value={tz} bind:group={lastHL} />
							<div class="btn btn-sik"><span>{tz.fullName}</span></div>
						</label>
					{/each}
				{:else}
					{#each SLoptions as tz}
						<label>
							<input type="radio" name="g" value={tz} bind:group={lastSL} />
							<div class="btn btn-sik"><span>{tz.fullName}</span></div>
						</label>
					{/each}
				{/if}
			</div>
			<div class="assessments">
				<div class="ass">
					{#each s as assessment, i}
						<Slider
							bind:value={assessments[i]}
							name={assessment.name}
							weight={assessment.weight}
							max={assessment.maxMarks}
						/>
					{/each}
				</div>
				<div class="predicted">
					<div class="container">
						<div class="x">Predicted Grade</div>
						{#if marksToIncrease}
							<div class="pp">{marksToIncrease} points away from next mark</div>
						{/if}
						<div class="y">
							{grade}
						</div>
					</div>
					<div class="container">
						<div class="x">Predicted Mark</div>
						<div class="pp">{str}</div>
						<div class="y">{mark}</div>
					</div>
				</div>
			</div>

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
						<div class="wrap">
							<label>
								<input type="radio" name="e" value={'SL'} bind:group={level} />
								<div class="btn btn-sik"><span>SL</span></div>
							</label>
							<label>
								<input type="radio" name="e" value={'HL'} bind:group={level} />
								<div class="btn btn-sik"><span>HL</span></div>
							</label>
						</div>
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
</div>

<style>
	h1 {
		margin: 0;
	}
	.p {
		font-size: small;
		font-weight: bold;
		margin: 0;
	}
	.pp {
		font-size: 8px;
		font-weight: 550;
		margin: 0;
		text-align: center;
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

	.assessments {
		display: flex;
		flex-direction: column;
	}

	.excel {
		display: flex;
		justify-content: center;
	}
	.ass {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
		margin-top: 8px;
	}

	.predicted {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.x {
		font-size: 20px;
		font-weight: bolder;
		padding: 0 20px;
	}

	.y {
		text-align: center;
		font-size: 40px;
		font-weight: bold;
	}

	.container {
		background-color: #e0f2fe;
		padding: 10px;
		border: 1px solid #d1d5db;
		border-radius: 10px;
		margin: 10px;
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
