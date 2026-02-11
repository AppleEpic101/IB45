<script>
	import Dropdown from '$lib/components/dropdown.svelte';
	import Slider from '$lib/components/slider.svelte';
	import ToggleSelect from '$lib/components/subject/ToggleSelect.svelte';
	import Meter from '$lib/components/subject/Meter.svelte';
	import GradeBoundaryUsed from '$lib/components/subject/GradeBoundaryUsed.svelte';

	import SLonlyWarning from '$lib/components/subject/SLonlyWarning.svelte';

	import { calculateNormalResults, calculateCoreResults } from '$lib/utils/boundaries.js';

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

<div class="calculator-controls">
	<div class="control-group">
		{#if data.isLang}
			<div class="control-item">
				<span class="control-label">Language</span>
				<Dropdown
					arr={syllabus.name === 'Classical Language' ? classical : languages}
					bind:value={language}
				/>
			</div>
		{/if}

		{#if syllabus.name !== 'Extended Essay' && syllabus.name !== 'Theory Of Knowledge' && !data.SLOnly}
			<div class="control-item">
				<span class="control-label">Level</span>
				<ToggleSelect identifier="ef" arr={['SL', 'HL']} arrVal={['SL', 'HL']} bind:value={level} />
			</div>
		{/if}
	</div>

	<div class="control-item">
		<span class="control-label">Timezone / Session</span>
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
	</div>
</div>

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
					<div class="y">Points Away</div>
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

	.calculator-controls {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2.5rem;
		padding: 1.5rem;
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}

	.control-group {
		display: flex;
		gap: 3rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.control-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.control-label {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.assessments {
		display: flex;
		flex-direction: row;
		gap: 32px;
		align-items: flex-start;
		margin-top: 20px;

		.left {
			flex: 1.4;
			display: flex;
			flex-direction: column;
			gap: 12px;
		}
	}

	.right {
		flex: 1;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 100px;

		.container {
			background-color: var(--color-surface-variant);
			color: var(--color-text-main);
			padding: 20px;
			border: 1px solid var(--color-border);
			border-radius: 12px;
			margin: 0;
			box-shadow: var(--shadow-md);

			.predicted {
				margin-top: 20px;

				.row {
					display: flex;
					justify-content: space-between;
				}
			}

			.x {
				text-align: center;
				font-size: 32px;
				font-weight: 800;
				padding: 0 20px;
				margin-bottom: 10px;
			}

			.y {
				font-size: 20px;
				font-weight: bold;
			}
		}
	}

	@media (max-width: 850px) {
		.assessments {
			flex-direction: column;
			gap: 20px;
		}

		.right {
			position: static;
			margin-top: 10px;
		}
	}
</style>
