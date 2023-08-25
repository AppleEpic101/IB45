<script>
	import { page } from '$app/stores';
	import { courses } from '$lib/stores/store.js';
	import data from '$lib/assets/courses.json';
	import Slider from '$lib/components/slider.svelte';
	import Links from '$lib/components/links.svelte';
	import Dropdown from '$lib/components/dropdown.svelte';
	import BoundaryTable from '$lib/components/boundaryTable.svelte';
	import CoreTable from '$lib/components/coreTable.svelte';
	import CoreMatrix from '$lib/components/coreMatrix.svelte';
	import M19 from '$lib/assets/Grade_BoundariesM19';
	import N19 from '$lib/assets/Grade_BoundariesN19';
	import N20 from '$lib/assets/Grade_BoundariesN20';
	import M21 from '$lib/assets/Grade_BoundariesM21';
	import M22 from '$lib/assets/Grade_BoundariesM22';
	import N22 from '$lib/assets/Grade_BoundariesN22';

	let pageStore = $page.params.name;
	let subject;
	$courses.forEach((obj) => {
		if (obj.short === pageStore) {
			subject = obj;
			pageStore = obj.name;
		}
	});

	const languages = [
		'English',
		'French',
		'Spanish',
		'Arabic',
		'Chinese',
		'Catalan',
		'Danish',
		'Dutch',
		'Finnish',
		'German',
		'Hindi',
		'Indonesian',
		'Italian',
		'Japanese',
		'Korean',
		'Lithuanian',
		'Malay',
		'Modern Greek',
		'Norwegian',
		'Polish',
		'Portuguese',
		'Russian',
		'Swedish',
		'Tamil',
		'Thai',
		'Turkish',
		'Vietnamese'
	];
	const languageSubjects = [
		'Language A: Literature',
		'Language A: Language And Literature',
		'Language AB Initio',
		'Language B'
	];
	const SLOnly = [
		'Language AB Initio',
		'Environmental Systems And Societies',
		'World Religions',
		'Literature And Performance'
	];
	const regions = ['Africa And Middle East', 'Americas', 'Asia And Oceania', 'Europe'];

	const isLanguageSubject = languageSubjects.includes(pageStore);
	let language;

	$: name = (language ?? '') + (language ? ' ' : '') + pageStore;

	const getTZ = (timezone, name, info) => {
		let arr = [];

		if (timezone && info) {
			timezone.forEach((tz, i) => {
				if (timezone.length === 1) {
					arr.push({ tz, name: info.short + ' TZ0', courseName: name });
				} else {
					arr.push({ tz, name: info.short + ' TZ' + (i + 1), courseName: name });
				}
			});
		}
		return arr;
	};

	const b = [M19, N19, N20, M21, M22, N22];
	let SLResults = [];
	let HLResults = [];

	$: {
		HLResults = [];
		SLResults = [];
		b.forEach((boundary) => {
			const info = boundary['info'];
			const HL = boundary['HL ' + name];
			const SL = boundary['SL ' + name];

			if (HL && info) {
				let timezone = [...HL.TZ];
				HLResults.push(...getTZ(timezone, 'HL ' + name, info));
			}

			if (SL && info) {
				let timezone = [...SL.TZ];
				SLResults.push(...getTZ(timezone, 'SL ' + name, info));
			}
		});
	}

	const historyResults = [[], [], [], []];
	regions.forEach((r, i) => {
		b.forEach((boundary) => {
			const info = boundary['info'];
			const c = boundary['HL History ' + r];

			if (c && info) {
				let timezone = [...c.TZ];
				historyResults[i].push(...getTZ(timezone, 'HL History ' + r, info));
			}
		});
	});

	const TOK = [];
	const EE = [];
	b.forEach((boundary) => {
		const info = boundary['info'];
		const c = boundary['Theory Of Knowledge'];
		const d = boundary['Extended Essay'];

		if (c && d && info) {
			let timezone = [...c.TZ];
			let timezone1 = [...d.TZ];

			TOK.push(...getTZ(timezone, 'Theory Of Knowledge', info));
			EE.push(...getTZ(timezone1, 'Extended Essay', info));
		}
	});

	let level = 'SL';
	let s;
	$: {
		if (level === 'HL') {
			s = subject.HL;
		} else {
			s = subject.SL;
		}
	}
	$: {
		if (s) {
			weight = s.map((a) => a.weight);
			marks = s.map((a) => a.maxMarks);
		}
	}
	let weight = [];
	let marks = [];
	let assessments = [];
	let grade;
	$: {
		grade = 0;
		for (let i = 0; i < weight.length; i++) {
			grade += (assessments[i] / marks[i]) * weight[i] * 100;
		}
		grade = Math.round(grade);
	}
</script>

<div class="body">
	<h1>{pageStore}</h1>
	<Links />
	<div class="description">
		<h3>Description</h3>
		{subject.description}
	</div>

	{#if pageStore !== 'Creativity, Activity, Service'}
		<h3>Assessment Model</h3>
		{#if SLOnly.includes(pageStore)}
			<h5>{pageStore} is offered only at the SL level</h5>
		{/if}
		{#if pageStore !== 'Extended Essay' && pageStore !== 'Theory Of Knowledge'}
			{#if !SLOnly.includes(pageStore)}
				<div class="wrap">
					<label>
						<input type="radio" name="e" value={'SL'} bind:group={level} />
						<div class="btn btn-sık"><span>SL</span></div>
					</label>
					<label>
						<input type="radio" name="e" value={'HL'} bind:group={level} />
						<div class="btn btn-sık"><span>HL</span></div>
					</label>
				</div>
			{/if}
		{/if}
		<br />
		<div class="assessments">
			<div class="ass">
				{#if s}
					{#each s as assessment, i}
						<Slider
							bind:value={assessments[i]}
							name={assessment.name}
							weight={assessment.weight}
							max={assessment.maxMarks}
						/>
					{/each}
				{/if}
			</div>

			<br />
			<br />
			<div class="container">
				<div class="x">Predicted Grade</div>
				<div class="y">
					{#if pageStore === 'Theory Of Knowledge' || pageStore === 'Extended Essay'}
						{assessments[0]}
					{:else}{grade}
					{/if}
				</div>
			</div>
		</div>

		<div class="grade">
			<h3>Historical Grade Boundaries</h3>
			{#if SLOnly.includes(pageStore)}
				<h5>{pageStore} is offered only at the SL level</h5>
			{/if}
			{#if isLanguageSubject}
				<Dropdown str="Enter language" arr={languages} bind:value={language} />
			{/if}
			<div class="tables">
				{#if pageStore === 'Theory Of Knowledge'}
					<CoreTable name={'TOK'} res={TOK} />
				{:else if pageStore === 'Extended Essay'}
					<CoreTable name={'EE'} res={EE} />
				{:else}
					<BoundaryTable name={'SL ' + name} res={SLResults} />
					{#if pageStore === 'History'}
						{#each regions as r, i}
							<BoundaryTable name={'HL History ' + r} res={historyResults[i]} />
						{/each}
					{:else if !SLOnly.includes(pageStore)}
						<BoundaryTable name={'HL ' + name} res={HLResults} />
					{/if}
				{/if}
				{#if pageStore === 'Theory Of Knowledge' || pageStore === 'Extended Essay'}
					<CoreMatrix name={pageStore} />
				{/if}
			</div>
			<p>*Example: M22 TZ0 = May 2022 Timezone 0</p>
			<p>Timezone 0 (Worldwide)</p>
			<p>Timezone 1 (North America, South America)</p>
			<p>Timezone 2 (Asia, Africa, Asia, Australia, Oceania)</p>
		</div>
	{/if}
</div>

<style>
	p {
		font-size: x-small;
		font-weight: bold;
	}
	.body {
		margin: 10px 50px;
		padding-bottom: 20px;
	}

	.tables {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
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
		margin: auto;
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

	.btn:hover {
		cursor: pointer;
	}

	.btn {
		text-align: center;
	}
	.btn-sık {
		transition: all 0.2s ease;
		background-color: var(--lightprimary);
		border: 2px solid black;
		padding: 5px 10px;
		border-radius: 10px;
		margin: 5px;
		box-shadow: 0 1px 1px black;
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
