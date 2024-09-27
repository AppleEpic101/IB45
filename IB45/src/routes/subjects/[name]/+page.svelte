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
	import { onMount } from 'svelte';

	import { page } from '$app/stores';
	import {
		calculateNormalResults,
		calculateCoreResults,
		getAllBoundaries,
		calculateGrade
	} from '$lib/group.js';

	export let data;
	let version = $page.url.searchParams.get('syl') || data?.firstAssessment;
	const datas = [data, ...data.old];

	$: syllabus = datas.find((a) => a.firstAssessment == version);

	const languages = data.info.lang;
	const classical = data.info.classical;

	// get language from query parameters
	let language;
	let langQuery = $page.url.searchParams.get('lang');
	if (data.name === 'Classical Language') {
		language = classical.includes(langQuery) ? langQuery : 'Latin';
	} else if (data.isLanguageSubject) {
		language = languages.includes(langQuery) ? langQuery : 'English';
	}

	// get level from query parameters
	let level = $page.url.searchParams.get('lvl') === 'HL' ? 'HL' : 'SL';
	$: s = level === 'HL' ? syllabus.HL : syllabus.SL;

	$: name = data.isLanguageSubject ? language + ' ' + data.name : data.name;

	// gets all previous grade boundaries (for table display)
	let lastSL;
	let lastHL;

	$: SLResults = data.isLanguageSubject
		? getAllBoundaries(data.name, language).SL
		: getAllBoundaries(data.name).SL;
	$: HLResults = data.isLanguageSubject
		? getAllBoundaries(data.name, language).HL
		: getAllBoundaries(data.name).HL;

	// gets the latest grade boundary (for awarded mark calculation)
	$: SLoptions = SLResults.filter((obj) => obj.short === 'N23' || obj.short === 'M24');
	$: HLoptions = HLResults.filter((obj) => obj.short === 'N23' || obj.short === 'M24');

	const init = async () => {
		if (SLoptions && HLoptions) {
			lastSL = SLoptions?.find(
				(obj) => obj.short === 'N23' && (obj.timezone === 0 || obj.timezone === 1)
			);

			lastHL = HLoptions?.find(
				(obj) => obj.short === 'N23' && (obj.timezone === 0 || obj.timezone === 1)
			);

			if (!lastSL) lastSL = SLoptions?.find((obj) => obj.short === 'N23');
			if (!lastSL) lastSL = SLoptions?.find((obj) => obj.short === 'M24');
			if (!lastSL) lastSL = SLoptions[SLoptions.length - 1];

			if (!lastHL) lastHL = HLoptions?.find((obj) => obj.short === 'N23');
			if (!lastHL) lastHL = HLoptions?.find((obj) => obj.short === 'M24');
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
	$: grade = calculateGrade(assessments, marks, weight, data.name);

	// calculate awarded mark
	let mark, str;
	$: {
		if (data.isCoreSubject) {
			mark = calculateCoreResults(grade, lastSL?.tz);
			str = 'Using the ' + lastSL?.fullName + ' grade boundary';
		} else {
			if (level === 'HL') {
				mark = calculateNormalResults(grade, lastHL?.tz);
				str = 'Using the ' + lastHL?.fullName + ' grade boundary';
			} else {
				mark = calculateNormalResults(grade, lastSL?.tz);
				str = 'Using the ' + lastSL?.fullName + ' grade boundary';
			}
		}

		// boundary not found
		if (
			(level === 'SL' && SLResults.length === 0 && !data.isCoreSubject) ||
			(level === 'HL' && HLResults.length === 0 && !data.isCoreSubject)
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
			updateUrl('lang', data.isLanguageSubject, language);
			updateUrl('lvl', level === 'HL' && !data.isCoreSubject, 'HL');
			updateUrl('syl', version && version !== data.firstAssessment, version);
			go();
		}
	}
</script>

<svelte:head>
	<title>IB {language || ''} {data.name} Grade Calculator</title>
	<meta
		name="description"
		content="Calculate your IB {language ||
			''} {data.name} grade! See historical grade boundary data, course descriptions, and more."
	/>
	<meta name="og:title" content="IB {language || ''} {data.name} Grade Calculator" />
	<meta
		name="og:description"
		content="Calculate your IB {language ||
			''} {data.name} grade! See historical grade boundary data, course descriptions, and more."
	/>
</svelte:head>

<div class="body">
	<a href="/subjects">
		<button class="btn btn-sik" in:fly={{ duration: 1300, y: 25 }}>back</button>
	</a>

	<div in:fly={{ duration: 1400, x: 200 }}>
		<h1>
			{syllabus.name}
			{#if syllabus.firstAssessment !== data.firstAssessment} ({syllabus.firstAssessment}) {/if}
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

	<Collapsible2 title="Description" content={syllabus.description} />

	<h4>Past Syllabuses</h4>
	<button
		class="btn btn-sik"
		on:click={() => {
			version = data.firstAssessment;
		}}>Current ({data.firstAssessment})</button
	>
	{#if data.old}
		{#each data.old as old}
			<button
				class="btn btn-sik"
				on:click={() => {
					version = old.firstAssessment;
				}}>{old.firstAssessment}-{old.lastAssessment}</button
			>
		{/each}
	{/if}

	<div in:fly={{ delay: 400, duration: 1000, x: 200 }}>
		{#if syllabus.name !== 'Creativity, Activity, Service'}
			<h4 in:fly={{ delay: 400, duration: 1000, x: 200 }}>Grade Calculator</h4>
			{#if data.SLOnly}
				<h5>
					{syllabus.name} is offered only at the SL level
				</h5>
			{/if}
			<div class="dropdown">
				{#if data.isLanguageSubject && syllabus.name === 'Classical Language'}
					<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
						<Dropdown arr={classical} bind:value={language} />
					</div>
				{:else if data.isLanguageSubject}
					<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
						<Dropdown arr={languages} bind:value={language} />
					</div>
				{/if}
			</div>
			{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge'}
				{#if !data.SLOnly}
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
			<div class="graph">
				<Bargraph name={syllabus.name} {level} {SLResults} {HLResults} {grade} />
			</div>

			<div class="grade">
				<h4 in:fly={{ delay: 400, duration: 1000, x: 200 }}>Historical Grade Boundaries</h4>
				{#if data.SLOnly}
					<h5 in:fly={{ delay: 400, duration: 1000, x: 200 }}>
						{syllabus.name} is offered only at the SL level
					</h5>
				{/if}
				{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge'}
					{#if !data.SLOnly}
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
					{#if data.isLanguageSubject && syllabus.name === 'Classical Language'}
						<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
							<Dropdown arr={classical} bind:value={language} />
						</div>
					{:else if data.isLanguageSubject}
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
						{#if !data.SLOnly}
							<BoundaryTable name={'HL ' + name} res={HLResults} />
						{/if}
					{/if}
				</div>
				<p class="p">*Timezone 0 (Worldwide)</p>
				<p class="p">*Timezone 1 (North America, South America)</p>
				<p class="p">*Timezone 2 (Europe, Africa, Asia, Australia, Oceania)</p>
				<p class="p">
					NOTE: N20, M21, N21, M22, N22 grade boundaries were artificially low due to COVID. There
					were also
				</p>
				<p class="p">
					NOTE: Beware of using outdated grade boundaries. Many subjects have since updated their
					syllabus.
				</p>
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
		margin: 10px 18%;
		padding-bottom: 20px;
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
		background-color: var(--lightprimary);
		padding: 10px;
		border: 2px solid black;
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
		background-color: var(--banner);
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
