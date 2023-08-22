<script>
	import { page } from '$app/stores';
	import data from '$lib/assets/courses.json';
	import Links from '$lib/components/Links.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import BoundaryTable from '$lib/components/boundaryTable.svelte';
	import CoreTable from '$lib/components/coreTable.svelte';
	import M19 from '$lib/assets/Grade_BoundariesM19';
	import M21 from '$lib/assets/Grade_BoundariesM21';
	import M22 from '$lib/assets/Grade_BoundariesM22';
	import N22 from '$lib/assets/Grade_BoundariesN22';

	const pageStore = $page.params.name;
	const subject = data[pageStore];

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

	const b = [M19, M21, M22, N22];
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
				timezone.forEach((tz, i) => {
					if (timezone.length === 1) {
						HLResults.push({ tz, name: info.short + ' TZ0', courseName: 'HL ' + name });
					} else {
						HLResults.push({ tz, name: info.short + ' TZ' + (i + 1), courseName: 'HL ' + name });
					}
				});
			}
			if (SL && info) {
				let timezone = [...SL.TZ];
				timezone.forEach((tz, i) => {
					if (timezone.length === 1) {
						SLResults.push({ tz, name: info.short + ' TZ0', courseName: 'SL ' + name });
					} else {
						SLResults.push({ tz, name: info.short + ' TZ' + (i + 1), courseName: 'SL ' + name });
					}
				});
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
				timezone.forEach((tz) => {
					if (timezone.length === 1) {
						historyResults[i].push({
							tz,
							name: info.short + ' TZ0',
							courseName: 'HL History ' + r
						});
					} else {
						historyResults[i].push({
							tz,
							name: info.short + ' TZ' + (i + 1),
							courseName: 'HL History ' + r
						});
					}
				});
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
			timezone.forEach((tz) => {
				if (timezone.length === 1) {
					TOK.push({
						tz,
						name: info.short + ' TZ0',
						courseName: 'Theory Of Knowledge'
					});
				} else {
					TOK.push({
						tz,
						name: info.short + ' TZ' + (i + 1),
						courseName: 'Theory Of Knowledge'
					});
				}
			});
			timezone1.forEach((tz) => {
				if (timezone1.length === 1) {
					EE.push({
						tz,
						name: info.short + ' TZ0',
						courseName: 'Extended Essay'
					});
				} else {
					EE.push({
						tz,
						name: info.short + ' TZ' + (i + 1),
						courseName: 'Extended Essay'
					});
				}
			});
		}
	});
</script>

<div class="body">
	<h1>{pageStore}</h1>
	<Links />
	<div class="description">
		<h3>Description</h3>
		{subject.description}
	</div>
	<!-- <div class="assessments">
		<h3>Assessment Model</h3>
		{#each subject.assessmentModel as s}
			<ul>
				<li>{s}</li>
			</ul>
		{/each}
	</div> -->
	{#if pageStore !== 'Creativity, Activity, Service'}
		<div class="grade">
			<h3>Historical Grade Boundaries</h3>
			{#if SLOnly.includes(pageStore)}
				<h5>This course is only offered at the SL level</h5>
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
			</div>
		</div>
	{/if}
</div>

<style>
	.body {
		margin: 10px 50px;
		padding-bottom: 20px;
	}

	.tables {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}

	@media screen and (max-width: 380px) {
		.body {
			margin: 0 10px;
		}
	}
</style>
