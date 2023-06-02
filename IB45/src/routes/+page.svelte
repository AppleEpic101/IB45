<script>
	import Group1 from './group1.svelte';
	import Group2 from './group2.svelte';
	import Group3 from './group3.svelte';
	import Group4 from './group4.svelte';
	import Group5 from './group5.svelte';
	import Group6 from './group6.svelte';
	import DetailedTable from './detailedTable.svelte';

	//let storage = [];

	let names = [];
	let scores = Array(6).fill(0);
	let sliderPositions = [];
	let totalScore;

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
	}

	let hasEarnedDiploma = false;
</script>

<nav>
	<img src="flc_design20230531154582.png" alt="Logo" />
	<h1>International Baccalaureate Diploma Programme <br /> <br />Predicted Score Calculator</h1>
</nav>

<div class="intro">
	<p>
		Welcome to IB Predict! <br />
		The purpose of this website is to help IB Diploma Programme students predict their IB scores. Score
		predictions are crucial towards university applications and must not deviate too greatly from the
		actual scores. This calculator will help you do just that.
	</p>
	<p>
		This calculator uses May 2022 grade boundaries. <br /><br />
		NOTE: For a given subject, if there is more than one timezone, the one with a stricter grading system
		(more challenging mark band) will be applied.
	</p>
</div>
<button
	on:click={() => {
		localStorage.clear();
		location.reload();
	}}
>
	Reset Selections
</button>
<div class="layout">
	<div class="left-column">
		<Group1 bind:awardedMark={scores[0]} />
		<Group2
			bind:fullName={names[1]}
			bind:awardedMark={scores[1]}
			bind:sliderPosition={sliderPositions[1]}
		/>
		<Group3
			bind:fullName={names[2]}
			bind:awardedMark={scores[2]}
			bind:sliderPosition={sliderPositions[2]}
		/>
		<Group4
			bind:fullName={names[3]}
			bind:awardedMark={scores[3]}
			bind:sliderPosition={sliderPositions[3]}
		/>
		<Group5
			bind:fullName={names[4]}
			bind:awardedMark={scores[4]}
			bind:sliderPosition={sliderPositions[4]}
		/>
		<Group6
			bind:fullName={names[5]}
			bind:awardedMark={scores[5]}
			bind:sliderPosition={sliderPositions[5]}
		/>
	</div>
	<div class="right-column">
		<div class="diploma">
			<h3>Total</h3>
			<div>Points: {totalScore} / 45</div>
			<div>Diploma Awarded: {hasEarnedDiploma}</div>
		</div>
		<DetailedTable courses={names} awardedMarks={scores} />
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	:global(html) {
		font-family: 'Helvetica Neue', Arial, sans-serif;
		background-color: white;
		color: black;
	}

	:global(nav) {
		/*position: fixed; */
		display: flex;
		gap: 20%;
		background-color: rgb(20, 181, 235);
		padding: 10px;
		text-align: center;
	}

	:global(a) {
		color: lightblue;
	}

	img {
		width: 200px;
		height: 100px;
		cursor: pointer;
		/* align-self: flex-start; */
	}

	.intro {
		margin: 0 5%;
	}
	.layout {
		display: grid;
		grid-template-columns: 4fr 1fr;
		margin: 20px 10%;
	}

	.diploma {
		display: inline-block;
		border: 2px solid black;
		border-radius: 10px;
		padding: 10px;
		background-color: rgb(32, 169, 41);
		text-align: center;
	}
</style>
