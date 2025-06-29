<script>
	import { fly, scale, fade } from 'svelte/transition';

	import Links from '$lib/components/links.svelte';
	import Button from '$lib/components/button.svelte';
	import Message from '$lib/components/Message.svelte';

	import GradeBoundarySelector from '$lib/components/MainCalculator/GradeBoundarySelector.svelte';
	import MainCalculator from '$lib/components/MainCalculator/MainCalculator.svelte';
	import Footnote from '$lib/components/Footnote.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title={'IB Grade Calculator'}
	description={'Will YOU do well on your upcoming International Baccalaureate (IB) exams? Use this IB grade calculator to find out!'}
/>

<div class="banner">
	<h1>World #1 Predicted Score Calculator</h1>
	<h1>for the</h1>
	<h1>IB Diploma Program</h1>
</div>
<div class="intro">
	<div class="welcome" in:fly={{ delay: 400, duration: 1000, x: 200 }}>
		<h2>Welcome to IB Predict!</h2>
		<h4>Last updated April 22, 2025</h4>
	</div>
	<div in:fly={{ delay: 400, duration: 1000, y: 100 }}>
		<p class="main">
			Meeting the conditional offers for your universities won't be easy, but IB Predict is here to
			help you along the way. Thank you to over 650,000 people that have used this calculator since
			its launch in June 2023. The IB Predict calculator uses grade boundary data from past IB
			examination cycles to ensure precision. IB Predict is intended for use by teachers,
			candidates, and school coordinators to ensure that predicted grades are accurate, fair, and
			serve a reliable basis for university admissions. With IB Predict, you'll know exactly what is
			needed in order to score a 4, 5, 6, or 7. No more, no less.
			<!-- <br /><br />
			Founded by successful IB DP alumni at Oxford, Caltech, and more, we support over hundreds of thousands of students and teachers from 150+ countries every year. Now maintained by current IB students, we are a community dedicated to supporting current students in their IB and future educational endeavors.
		</p> -->
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
			<strong>Upcoming May 2025 Syllabus Changes</strong>
		</p>
		<Button href={'./subjects/physics?syl=2025'} text={'Physics (2025)'} />
		<Button href={'./subjects/chemistry?syl=2025'} text={'Chemistry (2025)'} />
		<Button href={'./subjects/biology?syl=2025'} text={'Biology (2025)'} />
		<Button href={'./subjects/philosophy?syl=2025'} text={'Philosophy (2025)'} />

		<hr /> -->
		<hr />
		<hr />
		<GradeBoundarySelector />
		<MainCalculator />
		<Footnote />
	</div>
</div>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Space+Grotesk:wght@300..700&family=Montserrat+Alternates:wght@300&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
	$font-family: 'Montserrat', 'Space Grotesk', sans-serif;

	p {
		line-height: 2;
	}

	.banner {
		text-align: center;
		background-color: var(--banner);
		color: white;
		padding: 20px 1px;
		border-bottom: 2px solid black;
		font-family: var(--headerfont);
		border-right: 0.5px solid var(--primary);

		h1 {
			margin: 20px;
			font-weight: bold;
		}
	}

	.intro {
		width: 1150px;
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
		top: 70px;
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

	@media screen and (max-width: 1150px) {
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
