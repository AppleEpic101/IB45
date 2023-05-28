<script>
	import Group from './group.svelte';

	let groupScores = Array(6).fill(0);
	let totalScore = 0;
	let hasEarnedDiploma = false;
</script>

<nav>
	<h1>IB45 Score Calculator</h1>
</nav>

<div class="intro">
	<p>Welcome to IB45 Score Calculator,</p>
	<p>This calculator uses May 2022 grade boundaries</p>
</div>
<div class="layout">
	<div class="left-column">
		<Group groupNumber={1} />
		<Group groupNumber={2} />
		<Group groupNumber={3} />
		<Group groupNumber={4} />
		<Group groupNumber={5} />
		<Group groupNumber={6} />
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
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		background-color: white;
		color: black;
	}

	:global(nav) {
		background-color: rgb(20, 181, 235);
		padding: 10px;
		text-align: center;
	}

	:global(a) {
		color: lightblue;
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
		border: 2px solid white;
		border-radius: 10px;
		padding: 10px;
		background-color: rgb(32, 169, 41);
		text-align: center;
	}
</style>
