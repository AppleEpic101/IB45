<script>
	import Links from '$lib/components/links.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import Collapsible from '$lib/components/collapsible.svelte';
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => (ready = true));
</script>

<svelte:head>
	<title>Frequently Asked Questions</title>
	<meta
		name="description"
		content="Confused about how to use IB Predict? Check out our FAQ page to learn more about the IB Predict."
	/>
</svelte:head>

{#if ready}
	<div class="content">
		<h1 in:fly={{ delay: 100, duration: 1300, x: 200 }}>Frequently Asked Questions</h1>
		<Links />
		<p>
			I have compiled a list of the most frequently asked questions by users. You may contact me at <a
				href="mailto:admin@ibpredict.com">admin@ibpredict.com</a
			> if you would like to see a question added to this page.
		</p>
		<hr />
		<br />
		<Collapsible
			question="How do I replace my Group 6 subject with a subject from Groups 1-5?"
			answer="Very simple. Navigate to the Group 6 component of the home page. Then, click the first of three dropdowns and select the alternate group number. The second dropdown is the subject name and it will have changed to reflect the new group. "
		/>
		<Collapsible
			question="I am pursuing an IB Bilingual Diploma. How do I select multiple Language A subjects?"
			answer="A bilingual diploma is awarded when a mark of 3 or higher is achieved in two Group 1 subjects (excluding Literature And Performance; correct me if I am wrong). Therefore, you will choose one of two to input into the Group 1 component. Then, input your second Group 1 subject into the Group 2 component."
		/>
		<Collapsible
			question="Where are the [BLANK] grade boundaries?"
			bullet={[
				'Only grade boundaries from May 2019 to present are offered. If you would like past grade boundaries to be included and have a good reason for it, please contact me.',
				'May 2020 grade boundaries do not exist because examinations were cancelled.',
				'November 2021 grade boundaries do not exist because I cannot find them. If you have them, please contact me and I will add them to the website. ',
				'May 2023 grade boundaries will be added once they are released.'
			]}
		/>
		<Collapsible
			question="Why is the table indicating that the diploma is not awarded?"
			answer="The following are the only reasons for why the diploma was not awarded (pay attention to wording such as 'at least', 'less than', or 'less than or equal to'):"
			bullet={[
				'You have not selected 6 subjects in the calculator',
				'You have less than 24 total points',
				'You scored an E in TOK',
				'You scored an E on the Extended Essay',
				"You don't have either 3 or 4 HL subjects selected",
				'You scored at least single 1 on any subject',
				'You scored more than two 2s on any subjects',
				'You scored more than three 3s on any subjects',
				'The sum of the scores of your HL subjects is less than 12',
				'You take 3 SL subjects and the sum of the scores of your SL subjects is less than 9',
				'You take 2 SL subjects (consquently 4 HL subjects) and the sum of the scores of your SL subjects is less than 5'
			]}
		/>

		<Collapsible
			question="Why is the 'Boundary Not Found'"
			bullet={[
				'Analysis And Approaches and Applications And Interpretation were introduced in 2021. Data from before 2021 cannot be found for these subjects because it did not exist.',
				'Music was revised in 2022. SL Music cannot be found in data before 2022 because it did not exist.',
				'Otherwise, it is because that subject did not garner enough candidates (more than 100) to have data released for that particular grade boundary. It may be available for other grade boundaries. Simply cycle through the grade boundaries or more easily, go to its individual subject page and view all the past boundaries from there. If still none are found, it is because the subject has never garner enough people for data to be released from 2019 to present.'
			]}
		/>
	</div>
{/if}

<style>
	div {
		margin: 20px 18%;
	}

	p {
		line-height: 2;
	}

	@media screen and (max-width: 480px) {
		div {
			margin: 0 10px;
		}
	}
</style>
