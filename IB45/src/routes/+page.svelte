<script>
	import Group1 from './group1.svelte';
	import Group2 from './group2.svelte';
	import Group3 from './group3.svelte';
	import Group4 from './group4.svelte';
	import Group5 from './group5.svelte';
	import Group6 from './group6.svelte';

	let names = [];
	let scores = Array(6).fill(0);
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
		Welcome to IB45 Score Calculator! The purpose of this website is to help IB Diploma Programme
		students predict their IB scores. Score predictions are crucial towards university applications
		and must not deviate too greatly from the actual scores. This calculator will help do just that.
	</p>
	<p>
		This calculator uses May 2022 grade boundaries. <br /><br />
		NOTE: For a given subject, if there is more than one timezone, the one with a stricter grading system
		(more challenging mark band) will be applied.
	</p>
</div>
<div class="layout">
	<div class="left-column">
		<Group1 bind:fullName={names[0]} bind:awardedMark={scores[0]} />
		<Group2 bind:fullName={names[1]} />
		<Group3 bind:fullName={names[2]} />
		<Group4 bind:fullName={names[3]} />
		<Group5 bind:fullName={names[4]} />
		<Group6 bind:fullName={names[5]} />
		<!-- <Group groupNumber={2} />
		<Group groupNumber={3} />
		<Group groupNumber={4} />
		<Group groupNumber={5} />
		<Group groupNumber={6} /> -->
	</div>
	<div class="right-column">
		<div class="diploma">
			<h3>Total</h3>
			<div>Points: {totalScore} / 45</div>
			<div>Diploma Awarded: {hasEarnedDiploma}</div>
		</div>
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
		margin-left: 10%;
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
