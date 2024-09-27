<script>
	import { selectedGroup6 } from '$lib/stores/store.js';
	import { fly, scale, fade } from 'svelte/transition';
	import Group1 from '$lib/components/main/group1.svelte';
	import Group2 from '$lib/components/main/group2.svelte';
	import Group3 from '$lib/components/main/group3.svelte';
	import Group4 from '$lib/components/main/group4.svelte';
	import Group5 from '$lib/components/main/group5.svelte';
	import Group6 from '$lib/components/main/group6.svelte';
	import TOK from '$lib/components/main/TOK.svelte';
	import DetailedTable from '$lib/components/main/detailedTable.svelte';
	import GradeBoundary from '$lib/components/main/gradeboundary.svelte';
	import Timezone from '$lib/components/main/timezone.svelte';
	import Links from '$lib/components/links.svelte';
	import Refresh from '$lib/components/main/refresh.svelte';
	import Button from '$lib/components/button.svelte';
	import Message from '$lib/components/Message.svelte';

	let scores = [0, 0, 0, 0, 0, 0];
	let totalScore = 0;
	let tokGrade = 'E';
	let eeGrade = 'E';
	let corePoints;

	$: {
		totalScore = 0;
		for (let i = 0; i < scores.length; i++) {
			totalScore += scores[i];
		}
		totalScore += corePoints;
	}

	const components = {
		'1': Group1,
		'2': Group2,
		'3': Group3,
		'4': Group4,
		'5': Group5,
		'6': Group6
	};

	let Component;
	$: Component = components[$selectedGroup6];
</script>

<svelte:head>
	<title>IB Grade Calculator</title>
	<meta
		name="description"
		content="Will YOU do well on your upcoming International Baccalaureate (IB) exams? Use this IB grade calculator to find out!"
	/>
	<meta name="og:title" content="IB Predict" />
	<meta name="og:description" content="International Baccalaureate Grade Calculator" />
</svelte:head>

<div class="banner">
	<h1>International Baccalaureate Diploma Programme</h1>
	<h1>Predicted Score Calculator</h1>
</div>
<div class="intro">
	<div class="welcome" in:fly={{ delay: 400, duration: 1000, x: 200 }}>
		<h2>Welcome to IB Predict!</h2>
		<h4>Last updated September 26, 2024</h4>
	</div>
	<Links />
	<div in:fly={{ delay: 400, duration: 1000, y: 100 }}>
		<p class="main">
			Getting into the university of your dreams won't be easy, but IB Predict is here to help you
			along the way. In many cases, teachers submit inaccurate predicted grades, which significantly
			impacts a student's university endevors. The IB Predict calculator uses grade boundary data
			from past IB examinations to ensure precision. IB Predict is intended for use by teachers,
			candidates, and school coordinators to ensure that predicted grades are accurate, fair, and
			serve a reliable basis for university admissions. With IB Predict, you'll know exactly what is
			needed in order to score a 4, 5, 6, or 7. No more, no less.
		</p>

		<Message />

		<p><strong>Individual Grade Calculators</strong></p>

		<Button href={'./subjects/language-and-literature'} text={'Language & Literature'} />
		<Button href={'./subjects/literature'} text={'Literature'} />
		<Button href={'./subjects/language-b'} text={'Language B'} />
		<Button href={'./subjects/ab-initio'} text={'AB Initio'} />
		<Button href={'./subjects/business-management'} text={'Business Management'} />
		<Button href={'./subjects/economics'} text={'Economics'} />
		<Button href={'./subjects/history'} text={'History'} />
		<Button href={'./subjects/psychology'} text={'Psychology'} />
		<Button href={'./subjects/biology'} text={'Biology'} />
		<Button href={'./subjects/chemistry'} text={'Chemistry'} />
		<Button href={'./subjects/physics'} text={'Physics'} />
		<Button href={'./subjects/environmental-systems-and-societies'} text={'ESS'} />
		<Button href={'./subjects/analysis-and-approaches'} text={'Math AA'} />
		<Button href={'./subjects/applications-and-interpretation'} text={'Math AI'} />
		<Button href={'./subjects/visual-arts'} text={'Visual Arts'} />
		<Button href={'./subjects/theory-of-knowledge'} text={'TOK'} />
		<Button href={'./subjects/extended-essay'} text={'EE'} />
		<Button href={'./subjects'} text={'More...'} />

		<!-- <p>
			<strong>Upcoming May 2024 Syllabus Changes (old syllabuses archived as of April 9)</strong>
		</p>
		<Button href={'./subjects/business-management'} text={'Business Management (2024)'} />
		<Button href={'./subjects/classical-language'} text={'Classical Language (2024)'} />
		<Button href={'./subjects/digital-society'} text={'Digital Society (2024)'} />
		<Button
			href={'./subjects/literature-and-performance'}
			text={'Literature & Performance (2024)'}
		/> -->
		<hr />
	</div>

	<div in:fade={{ delay: 150, duration: 1300 }} class="multipleChoice">
		<GradeBoundary />
		<Timezone />
	</div>
	<div class="top-table">
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

<div class="layout">
	<div in:fly={{ delay: 250, duration: 1500, x: -300 }} class="left-column">
		<Refresh />
		<Group1 bind:awardedMark={scores[0]} />
		<Group2 bind:awardedMark={scores[1]} />
		<Group3 bind:awardedMark={scores[2]} />
		<Group4 bind:awardedMark={scores[3]} />
		<Group5 bind:awardedMark={scores[4]} />
		{#if Component}
			<svelte:component this={Component} bind:awardedMark={scores[5]} groupNumber="6" />
		{/if}
		<TOK bind:awardedMark={tokGrade} bind:ee={eeGrade} bind:corePoints />
		<Refresh />
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

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Space+Grotesk:wght@300..700&display=swap');
	$font-family: 'Space Grotesk', sans-serif;

	p {
		line-height: 2;
	}

	.banner {
		text-align: center;
		background-color: var(--banner);
		color: white;
		padding: 1px;
		border-bottom: 2px solid black;
		font-family: 'Courier New', Courier, monospace;
		border-right: 0.5px solid var(--lightprimary);

		h1 {
			margin: 65px;
		}
	}

	.intro {
		width: 950px;
		margin: 0 auto;
	}

	.layout {
		display: grid;
		grid-template-columns: 4fr 275px;
		margin: 20px auto;
		max-width: 950px;
	}

	.data {
		position: -webkit-sticky;
		position: sticky;
		top: 10px;
	}

	.top-table {
		display: none;
	}

	.welcome {
		font-family: $font-family;

		h2 {
			margin-bottom: 0;
		}
		h4 {
			margin: 0 0 15px 0;
		}
	}

	@media screen and (max-width: 1000px) {
		.intro {
			margin: 0 25px;
			width: auto;
		}
		p {
			line-height: 1.5;
		}
	}

	@media screen and (max-width: 710px) {
		.layout {
			grid-template-columns: 1fr 1fr;
		}
	}
	@media screen and (max-width: 560px) {
		.right-column {
			display: none;
		}

		.top-table {
			display: initial;
		}
		.layout {
			display: block;
		}
	}

	@media screen and (max-width: 1000px) {
		.layout {
			margin: 20px 10px;
		}
	}

	@media screen and (max-width: 700px) {
		.banner h1 {
			font-size: 23px;
			margin: 50px 30px;
		}
		.intro {
			margin: 0 5%;
		}
		.main {
			font-size: small;
		}
	}

	@media screen and (max-width: 420px) {
		.intro h2 {
			font-size: 1.2em;
			margin-bottom: 0;
		}
		.intro h4 {
			font-size: 1em;
			margin: 5px 0 15px 0;
		}
		.main {
			font-size: 0.8em;
		}
		p {
			line-height: 1.3;
		}
	}
</style>
