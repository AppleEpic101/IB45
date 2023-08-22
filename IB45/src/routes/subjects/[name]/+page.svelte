<script>
	import { page } from '$app/stores';
	import data from '$lib/assets/courses.json';
	import Links from '$lib/components/Links.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
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
		console.log(HLResults);
		console.log(SLResults);
	}
</script>

<div class="body">
	<h1>{pageStore}</h1>
	<Links />
	<br />
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
	<div class="grade">
		<h3>Historical Grade Boundaries</h3>
		{#if SLOnly.includes(pageStore)}
			<h5>This course is only offered at the SL level</h5>
		{/if}
		{#if isLanguageSubject}
			<Dropdown str="Enter language" arr={languages} bind:value={language} />
		{/if}
		<div class="tables">
			<table>
				<tr>
					<th colspan="8">{'SL ' + name}</th>
				</tr>
				<tr>
					<th rowspan="2">Timezone</th>
					<th colspan="7">Grade</th>
				</tr>
				<tr class="small">
					{#each { length: 7 } as _, i}
						<th>{i + 1}</th>
					{/each}
				</tr>

				{#each SLResults as result}
					<tr>
						<td>{result.name}</td>
						{#each result.tz as tz}
							<td>{tz}</td>
						{/each}
					</tr>
				{/each}
			</table>
			{#if !SLOnly.includes(pageStore)}
				<table>
					<tr>
						<th colspan="8">{'HL ' + name}</th>
					</tr>
					<tr>
						<th rowspan="2">Timezone</th>
						<th colspan="7">Grade</th>
					</tr>
					<tr class="small">
						{#each { length: 7 } as _, i}
							<th>{i + 1}</th>
						{/each}
					</tr>

					{#each HLResults as result}
						<tr>
							<td>{result.name}</td>
							{#each result.tz as tz}
								<td>{tz}</td>
							{/each}
						</tr>
					{/each}
				</table>
			{/if}
		</div>
	</div>
</div>

<style>
	.body {
		margin: 10px 50px;
	}

	.tables {
		display: flex;
		justify-content: space-evenly;
		flex-wrap: wrap;
	}

	table,
	tr,
	th,
	td {
		border: 2px solid black;
		border-collapse: collapse;
		text-align: center;
		background-color: var(--lightprimary);
	}
	table {
		width: 25vw;
		margin-top: 10px;
	}

	@media screen and (max-width: 380px) {
		.body {
			margin: 0 10px;
		}
	}
</style>
