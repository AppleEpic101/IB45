<script>
	import { selectedGroup6 } from '$lib/stores/store.js';
	import Group1 from '$lib/components/group1.svelte';
	import Group2 from '$lib/components/group2.svelte';
	import Group3 from '$lib/components/group3.svelte';
	import Group4 from '$lib/components/group4.svelte';
	import Group5 from '$lib/components/group5.svelte';
	import Group6 from '$lib/components/group6.svelte';
	import TOK from '$lib/components/TOK.svelte';
	import DetailedTable from '$lib/components/detailedTable.svelte';
	import SelectedGroup6 from '$lib/components/selectedGroup6.svelte';
	import GradeBoundary from '$lib/components/gradeboundary.svelte';
	import Timezone from '$lib/components/timezone.svelte';

	let scores = [];
	let totalScore;
	let tokGrade;
	let eeGrade;
	let corePoints;

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
		totalScore += corePoints;
	}
</script>

<div class="banner">
	<h1>
		International Baccalaureate Diploma Programme <br /> <br /> Predicted Score Calculator
	</h1>
</div>
<div class="intro">
	<div>
		<h2>Welcome to IB Predict!</h2>
		<h3>Last updated August 19, 2023</h3>
	</div>
	<p>
		This score calculator allows IB Diploma Programme students to predict their final IB grade
		accurately. The significance of score predictions when it comes to university applications
		cannot be understated. Our IB predicted grade calculator incorporates official grade boundaries
		data from previous IB administrations, giving you the most accurate grade predictions possible.
	</p>

	<hr />
	<strong>
		<ul>
			<li>
				NOTE: May 2023 grade boundaries are coming soon (official boundaries likely released in
				October).
			</li>
		</ul>
	</strong>

	<div class="multipleChoice">
		<SelectedGroup6 />
		<GradeBoundary />
		<Timezone />
	</div>
	<!-- <label>
		<input type="checkbox" />
		<span class="slider round">Detailed Mode</span>
	</label> -->
</div>

<div class="layout">
	<div class="left-column">
		<button
			on:click={() => {
				localStorage.clear();
				location.reload();
			}}
		>
			Reset Selections
		</button>
		<Group1 bind:awardedMark={scores[0]} />
		<Group2 bind:awardedMark={scores[1]} />
		<Group3 bind:awardedMark={scores[2]} />
		<Group4 bind:awardedMark={scores[3]} />
		<Group5 bind:awardedMark={scores[4]} />
		{#if $selectedGroup6 == '6'}
			<Group6 bind:awardedMark={scores[5]} />
		{:else if $selectedGroup6 == '1'}
			<Group1 bind:awardedMark={scores[5]} groupNumber="6" />
		{:else if $selectedGroup6 == '2'}
			<Group2 bind:awardedMark={scores[5]} groupNumber="6" />
		{:else if $selectedGroup6 == '3'}
			<Group3 bind:awardedMark={scores[5]} groupNumber="6" />
		{:else if $selectedGroup6 == '4'}
			<Group4 bind:awardedMark={scores[5]} groupNumber="6" />
		{/if}
		<TOK bind:awardedMark={tokGrade} bind:ee={eeGrade} bind:corePoints />
		<button
			on:click={() => {
				localStorage.clear();
				location.reload();
			}}
		>
			Reset Selections
		</button>
	</div>
	<div class="right-column">
		<div class="data">
			<div class="table">
				<DetailedTable
					points={totalScore}
					awardedMarks={scores}
					tok={tokGrade}
					ee={eeGrade}
					{corePoints}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	:global(html) {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		background-color: var(--primary);
		color: black;
	}

	:global(body) {
		background-color: var(--background);
		margin: 0;
		padding: 0;
		overscroll-behavior-x: none;
	}

	:global(nav) {
		width: 100%;
		display: flex;
		background-color: var(--primary);
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid black;
	}

	:global(.top-links) {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: 5px;

		width: 100%;
	}

	:global(.top-links a) {
		margin-right: 10px;
		color: black;
		text-decoration: none;
		font-size: 1.2em;
	}
	p {
		line-height: 2;
	}

	button {
		background-color: var(--lightprimary);
		padding: 15px;
		margin: 10px 0;
		cursor: pointer;
		border: 2px solid black;
		border-radius: 5px;
		color: black;
	}

	button:hover {
		background-color: var(--primary);
		transition: 0.3s ease-in-out;
	}

	.banner {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		background-color: var(--banner);
		color: white;
		text-shadow: 1px 1px 1px navyblue;
		padding: 0;
		height: 400px;
		border-bottom: 2px solid black;
		font-family: 'Courier New', Courier, monospace;
	}

	.intro {
		margin: 0 10%;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 1fr;
		margin: 20px 5%;
	}

	.data {
		position: -webkit-sticky;
		position: sticky;
		top: 10px;
	}

	li {
		padding: 5px;
	}

	@media screen and (max-width: 560px) {
		.layout {
			display: block;
		}
		.banner {
			height: 300px;
		}
	}
</style>
