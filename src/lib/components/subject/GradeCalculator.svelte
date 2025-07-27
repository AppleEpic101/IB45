<script>
	import Dropdown from '$lib/components/dropdown.svelte';
	import Slider from '$lib/components/slider.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import Meter from '$lib/components/subject/Meter.svelte';
	import GradeBoundaryUsed from '$lib/components/subject/GradeBoundaryUsed.svelte';

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

	export let showGradeGraphs;

	export let mark;
	export let marksToIncrease;

	export let assessments;
	export let classical;
	export let languages;

	const gradeMap = {
		E: 1,
		D: 2,
		C: 3,
		B: 4,
		A: 5
	};

	let str;
	let gradeBoundaryUsed;
	$: {
		if (data.isCore) {
			mark = calculateCoreResults(grade, lastSL?.tz);
			gradeBoundaryUsed = {
				name: lastSL?.fullName,
				marks: lastSL?.tz
			};
			marksToIncrease = lastSL?.tz[gradeMap[mark]] - grade;
			str = 'Using the ' + lastSL?.fullName + ' grade boundary';
		} else {
			if (level === 'HL') {
				mark = calculateNormalResults(grade, lastHL?.tz);
				gradeBoundaryUsed = {
					name: lastHL?.fullName,
					marks: lastHL?.tz
				};
				marksToIncrease = lastHL?.tz[mark] - grade;
				str = 'Using the ' + lastHL?.fullName + ' grade boundary';
			} else {
				mark = calculateNormalResults(grade, lastSL?.tz);
				gradeBoundaryUsed = {
					name: lastSL?.fullName,
					marks: lastSL?.tz
				};
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
			showGradeGraphs = false;
		} else {
			showGradeGraphs = true;
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
	<div class="left">
		{#each s as assessment, i}
			<Slider
				bind:value={assessments[i]}
				name={assessment.name}
				weight={assessment.weight}
				max={assessment.maxMarks}
			/>
		{/each}
	</div>

	<div class="right">
		<div class="container">
			<div>
				<div class="x">Predicted Mark</div>
				{#if data.isCore}
					<Meter value={gradeMap[mark]} totalSegments={5} isCore={data.isCore} />
				{:else}
					<Meter value={mark} />
				{/if}

				<div class="pp">{str}</div>
			</div>
			<div class="predicted">
				<div class="row">
					<div class="y">Grade</div>

					<div class="y">
						{grade}%
					</div>
				</div>

				<div class="row">
					<div class="y">Points Away From Next Mark</div>
					{#if marksToIncrease}
						<div class="y">{marksToIncrease}%</div>
					{:else}
						<div class="y">N/A</div>
					{/if}
				</div>
				<GradeBoundaryUsed {gradeBoundaryUsed} mark={data.isCore ? gradeMap[mark] : mark} />
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.pp {
		font-size: 12px;
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
		flex-direction: row;
		gap: 50px;
		.left {
			flex: 3;
			display: flex;
			flex-direction: column;
			flex-wrap: wrap;
			align-items: flex-start;
			margin-top: 8px;
		}
	}

	.right {
		flex: 2;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;

		.container {
			background-color: #e0f2fe;
			padding: 10px;
			border: 1px solid #d1d5db;
			border-radius: 10px;
			margin: 10px;

			.predicted {
				margin-top: 20px;

				.row {
					display: flex;
					justify-content: space-between;
				}
			}

			.x {
				text-align: center;
				font-size: 25px;
				font-weight: bolder;
				padding: 0 20px;
			}

			.y {
				font-size: 20px;
				font-weight: bold;
			}
		}
	}

	@media (max-width: 500px) {
		.assessments {
			flex-direction: column;
			gap: 0;
			.left {
				width: 100%;
			}
			.right {
				width: 100%;
			}
		}
	}
</style>
