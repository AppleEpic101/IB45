<script>
	import { fade, fly, scale } from 'svelte/transition';
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
	import d from '$lib/assets/courses';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => (ready = true));

	export let data;

	const newUrl = new URL($page.url);

	const languages = d['info'].lang;
	const regions = d['info'].region;
	const classical = d['info'].classical;

	let language;
	if (
		(languages.includes($page.url.searchParams.get('lang')) &&
			data.name !== 'Classical Language') ||
		(classical.includes($page.url.searchParams.get('lang')) && data.name === 'Classical Language')
	) {
		language = $page.url.searchParams.get('lang');
	} else {
		if (data.name === 'Classical Language') language = 'Latin';
		else language = 'English';
	}

	$: name = data.isLanguageSubject ? language + ' ' + data.name : data.name;

	const getTZ = (timezone, name, info) => {
		let arr = [];

		timezone.forEach((tz, i) => {
			if (timezone.length === 1) {
				arr.push({ tz, name: info.short + ' TZ0', courseName: name });
			} else {
				arr.push({ tz, name: info.short + ' TZ' + (i + 1), courseName: name });
			}
		});

		return arr;
	};

	const b = [M19, N19, N20, M21, M22, N22];
	let SLResults = [];
	let HLResults = [];

	let lastSL;
	let lastHL;

	$: {
		HLResults = [];
		SLResults = [];
		b.forEach((boundary) => {
			const info = boundary['info'];
			const HL = boundary['HL ' + name];
			const SL = boundary['SL ' + name];

			if (HL && info) {
				let timezone = [...HL.TZ];
				lastHL = getTZ(timezone, 'HL ' + name, info);
				HLResults.push(...getTZ(timezone, 'HL ' + name, info));
			}

			if (SL && info) {
				let timezone = [...SL.TZ];
				lastSL = getTZ(timezone, 'SL ' + name, info);
				SLResults.push(...getTZ(timezone, 'SL ' + name, info));
			}
		});
	}

	let level = $page.url.searchParams.get('lvl') === 'HL' ? 'HL' : 'SL';
	let s;
	$: {
		if (level === 'HL') {
			s = data.HL;
		} else {
			s = data.SL;
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
		if (data.name === 'Theory Of Knowledge' || data.name === 'Extended Essay') {
			for (let i = 0; i < weight.length; i++) {
				grade += assessments[i];
			}
		} else {
			for (let i = 0; i < weight.length; i++) {
				grade += (assessments[i] / marks[i]) * weight[i] * 100;
			}
		}
		grade = Math.round(grade);
	}

	let reg = 'Americas';

	let mark, str;
	const letters = ['E', 'D', 'C', 'B', 'A'];
	$: {
		mark = 0;
		if (data.name === 'History' && level === 'HL') {
			const h = data.lastHistory[regions.indexOf(reg)];
			h[0].tz.forEach((a) => {
				if (grade >= a) {
					mark++;
				}
			});
			str = 'Using the ' + h[0].name + ' grade boundary';
		} else if (
			data.name !== 'Theory Of Knowledge' &&
			data.name !== 'Extended Essay' &&
			data.name !== 'Creativity, Activity, Service'
		) {
			if (lastSL && level === 'SL') {
				lastSL[0].tz.forEach((a) => {
					if (grade >= a) {
						mark++;
					}
				});
				str =
					lastSL.length === 1
						? 'Using the ' + lastSL[0].name + ' grade boundary'
						: 'Using the ' + lastSL[0].name + ' grade boundary';
			} else if (lastHL && level === 'HL') {
				lastHL[0].tz.forEach((a) => {
					if (grade >= a) {
						mark++;
					}
				});
				str =
					lastHL.length === 1
						? 'Using the ' + lastHL[0].name + ' grade boundary'
						: 'Using the ' + lastHL[0].name + ' grade boundary';
			}
		} else if (data.name === 'Theory Of Knowledge') {
			const t = data.lastTOK;
			t[0].tz.forEach((a) => {
				if (grade >= a) {
					mark++;
				}
			});
			str = 'Using the ' + t[0].name + ' grade boundary';
			mark = letters[parseInt(mark) - 1];
		} else if (data.name === 'Extended Essay') {
			const e = data.lastEE;
			str = 'Using the ' + e[0].name + ' grade boundary';
			e[0].tz.forEach((a) => {
				if (grade >= a) {
					mark++;
				}
			});
			mark = letters[parseInt(mark) - 1];
		}
		if (!str) {
			str = 'No grade boundary data available';
		}
	}

	$: {
		if (data.isLanguageSubject) {
			newUrl?.searchParams?.set('lang', language);
			if (browser) goto(newUrl);
		} else {
			newUrl?.searchParams?.delete('lang');
			if (browser) goto(newUrl);
		}
		if (level === 'HL' && !data.isCoreSubject) {
			newUrl?.searchParams?.set('lvl', 'HL');
			if (browser) goto(newUrl);
		} else if (level === 'SL') {
			newUrl?.searchParams?.delete('lvl');
			if (browser) goto(newUrl);
		}
	}
</script>

<svelte:head>
	{#if data.name !== 'Creativity, Activity, Service' && data.name !== 'Theory Of Knowledge' && data.name !== 'Extended Essay'}
		<title>IB {data.name} Calculator</title>
		<meta
			name="description"
			content="Calculate your IB {data.name} grade! See historical grade boundary data, course descriptions, and more."
		/>
	{:else}
		<title>{data.name} Calculator</title>
		<meta
			name="description"
			content="Calculate your {data.name} grade! See historical grade boundary data, course descriptions, and more."
		/>
	{/if}
</svelte:head>

{#if ready}
	<div class="body">
		<a href="/subjects" in:fly={{ delay: 100, duration: 1300, y: 25 }}
			><button class="btn btn-sık">back</button></a
		>

		<div in:fly={{ duration: 1400, x: 200 }}>
			<h1>{data.name}</h1>

			<h4>
				{#if data.groupNumber.length === 2}
					{#if data.groupNumber[1] === 's'}
						Group {data.groupNumber[0]} school-based syllabus subject <br />
					{:else}
						Group {data.groupNumber[0]} and {data.groupNumber[1]} interdisciplinary subject<br />
					{/if}
				{:else if data.groupNumber[0] === 99}
					Core subject <br />
				{:else if data.groupNumber.length === 1}
					Group {data.groupNumber} subject <br />
				{/if}
				Assessments from {data.firstAssessment} to {data.lastAssessment}
			</h4>
		</div>
		<Links />
		<div class="description">
			<h3 in:fly={{ delay: 100, duration: 1300, x: 200 }}>Description</h3>
			<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>{data.description}</div>
		</div>

		<div in:fly={{ delay: 400, duration: 1000, x: 200 }}>
			{#if data.name !== 'Creativity, Activity, Service'}
				<h3 in:fly={{ delay: 400, duration: 1000, x: 200 }}>Grade Calculator</h3>
				{#if data.SLOnly}
					<h5>
						{data.name} is offered only at the SL level
					</h5>
				{/if}
				<div class="dropdown">
					{#if data.isLanguageSubject && data.name === 'Classical Language'}
						<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
							<Dropdown arr={classical} bind:value={language} />
						</div>
					{:else if data.isLanguageSubject}
						<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
							<Dropdown arr={languages} bind:value={language} />
						</div>
					{/if}
					{#if data.name === 'History' && level === 'HL'}
						<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
							<Dropdown arr={regions} bind:value={reg} />
						</div>
					{/if}
				</div>
				{#if data.name !== 'Extended Essay' && data.name !== 'Theory Of Knowledge'}
					{#if !data.SLOnly}
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
				<div class="grade">
					<h3 in:fly={{ delay: 400, duration: 1000, x: 200 }}>Historical Grade Boundaries</h3>
					{#if data.SLOnly}
						<h5 in:fly={{ delay: 400, duration: 1000, x: 200 }}>
							{data.name} is offered only at the SL level
						</h5>
					{/if}
					<div class="dropdown">
						{#if data.isLanguageSubject && data.name === 'Classical Language'}
							<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
								<Dropdown arr={classical} bind:value={language} />
							</div>
						{:else if data.isLanguageSubject}
							<div in:fly={{ delay: 100, duration: 1300, y: 25 }}>
								<Dropdown arr={languages} bind:value={language} />
							</div>
						{/if}
					</div>
					<div class="tables">
						{#if data.name === 'Theory Of Knowledge'}
							<CoreTable name={'TOK'} res={data.TOK} />
						{:else if data.name === 'Extended Essay'}
							<CoreTable name={'EE'} res={data.EE} />
						{:else}
							<BoundaryTable name={'SL ' + name} res={SLResults} />
							{#if data.name === 'History'}
								{#each regions as r, i}
									<BoundaryTable name={'HL History ' + r} res={data.historyResults[i]} />
								{/each}
							{:else if !data.SLOnly}
								<BoundaryTable name={'HL ' + name} res={HLResults} />
							{/if}
						{/if}
						{#if data.name === 'Theory Of Knowledge' || data.name === 'Extended Essay'}
							<CoreMatrix name={data.name} />
						{/if}
					</div>
					<p class="p">*Timezone 0 (Worldwide)</p>
					<p class="p">*Timezone 1 (North America, South America)</p>
					<p class="p">*Timezone 2 (Europe, Africa, Asia, Australia, Oceania)</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

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
		color: black;
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

	@media screen and (max-width: 800px) {
		.description {
			font-size: small;
		}
	}

	@media screen and (max-width: 500px) {
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
