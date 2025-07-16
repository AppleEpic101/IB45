<script>
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Slider from '$lib/components/slider.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';

	import SLonlyWarning from '$lib/components/subject/SLonlyWarning.svelte';

	import { calculateNormalResults, calculateCoreResults } from '$lib/group.js';

	export let data;
	export let syllabus;
	export let s;
	export let grade;
	export let language;
	export let level;
	export let lastSL;
	export let lastHL;
	export let SLoptions;
	export let HLoptions;
	export let SLResults;
	export let HLResults;

	export let assessments;
	export let classical;
	export let languages;

	let mark;
	let marksToIncrease;
	let str;
	$: {
		if (data.isCore) {
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

		if (
			(level === 'SL' && SLResults.length === 0 && !data.isCore) ||
			(level === 'HL' && HLResults.length === 0 && !data.isCore)
		) {
			str = 'No grade boundary data available';
			mark = 'N/A';
		}
	}
</script>

<h4>Grade Calculator</h4>
<SLonlyWarning {data} {syllabus} />

<div class="dropdown">
	{#if data.isLang && syllabus.name === 'Classical Language'}
		<div>
			<Dropdown arr={classical} bind:value={language} />
		</div>
	{:else if data.isLang}
		<div>
			<Dropdown arr={languages} bind:value={language} />
		</div>
	{/if}
</div>

{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge'}
	{#if !data.SLOnly}
		<ToggleSelect identifier="ef" arr={['SL', 'HL']} arrVal={['SL', 'HL']} bind:value={level} />
	{/if}
{/if}

{#if level === 'HL'}
	<ToggleSelect
		identifier="f"
		arr={HLoptions.map((tz) => tz.fullName)}
		arrVal={HLoptions}
		bind:value={lastHL}
	/>
{:else}
	<ToggleSelect
		identifier="g"
		arr={SLoptions.map((tz) => tz.fullName)}
		arrVal={SLoptions}
		bind:value={lastSL}
	/>
{/if}

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

<style lang="scss">
	.pp {
		font-size: 8px;
		font-weight: 550;
		margin: 0;
		text-align: center;
	}

	.dropdown {
		display: flex;
		justify-content: center;
	}

	.assessments {
		display: flex;
		flex-direction: column;

		.ass {
			display: flex;
			flex-wrap: wrap;
			align-items: flex-start;
			justify-content: center;
			margin-top: 8px;
		}
	}

	.wrap {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		label {
			position: relative;
			display: inline-block;
			text-align: center;
		}
	}

	.predicted {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;

		.container {
			background-color: #e0f2fe;
			padding: 10px;
			border: 1px solid #d1d5db;
			border-radius: 10px;
			margin: 10px;

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
		}
	}
</style>
