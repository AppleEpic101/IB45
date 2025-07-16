<script>
	import { fade, fly, scale } from 'svelte/transition';
	import Collapsible from '$lib/components/collapsible.svelte';
	import { onMount } from 'svelte';
	let ready = false;
	onMount(() => (ready = true));
	import Discord from '$lib/components/Discord.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="Frequently Asked Questions"
	description="Confused about how to use IB Predict? Check out our FAQ page to learn more about the IB Predict."
/>

<div class="content" in:fly={{ duration: 1400, x: 200 }}>
	<h1>Frequently Asked Questions</h1>
	<div>
		<p>
			I have compiled a list of the most frequently asked questions by users. You may contact me at <a
				href="mailto:admin@ibpredict.org">admin@ibpredict.org</a
			> if you would like to see a question added to this page.
		</p>
		<Discord />
		<hr />
	</div>
	<br />
	<div>
		<Collapsible
			question="Are these grade boundaries real/legit?"
			answer="Yes. These are official grade boundaries from past examinations."
		/>
		<Collapsible
			question="Is this calculator accurate?"
			answer="Assume yes with good judgement. Boundaries always vary year to year, so if you are near a borderline threshold, it could go either way. If you are taking a new course (e.g. new 2025 sciences courses), then slightly less so because there's no existing data, so the best we can do is give an approximation based on the old curriculum.  "
		/>
		<Collapsible
			question="Why does the calculator predict a different grade than my official predicted grade?"
			answer="Your IB Predicted Grade is determined by your teacher (e.g. performance in class, mock exams). Your final exam is determined by your performance on the actual IB exams. The latter is what IB Predict is trying to predict. The calculator is not meant to replace your official predicted grade, but rather to give you an idea of how you might perform on the final exam based on your current performance."
		/>
		<Collapsible
			question="When will grade boundaries be posted for the latest exam session?"
			answer="September for May examinations and March for November examinations. This is because the IB takes a while to release grade boundaries, and I have to wait until they are released before I can update the website. If you get them before I do, please send it to me. "
		/>
		<Collapsible
			question="Why is the Boundary Not Found?"
			bullet={[
				'If you are using a November grade boundary, it is likely because the subject was very unpopular. Subjects that do not garner enough candidates (more than 100) do no have available grade boundary data. Please refer to the individual grade boundary calculator by clicking "More details"',
				'Analysis And Approaches and Applications And Interpretation were introduced in 2021. Data from before 2021 cannot be found for these subjects because it did not exist.',
				'Music was revised in 2022. SL Music cannot be found in data before 2022 because it did not exist.'
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
			question="How do I replace my Group 6 subject with a subject from Groups 1-5?"
			answer="Very simple. Navigate to the Group 6 component of the home page. Then, click the first of three dropdowns and select the alternate group number. The second dropdown is the subject name and it will have changed to reflect the new group. "
		/>
		<Collapsible
			question="I am pursuing an IB Bilingual Diploma. How do I select multiple Language A subjects?"
			answer="A bilingual diploma is awarded when a mark of 3 or higher is achieved in at least two Group 1 subjects (excluding Literature And Performance; correct me if I am wrong. The second Group 1 subject may be selected under Group 2. You may even select a third by replacing your Group 6 with a Group 1 subject. "
		/>
		<Collapsible
			question="How does the calculator work?"
			answer="Your grade out of 100 is calculated using a weighted average of the inputed assessment scores, then rounded to the nearest integer. A score is then assigned using that grade with a grade boundary."
		/>
		<Collapsible
			question="Where are the [BLANK] grade boundaries?"
			bullet={[
				'Only grade boundaries from May 2019 to present are offered. If you would like past grade boundaries to be included and have a good reason for it, please contact me.',
				'May 2020 grade boundaries do not exist because examinations were cancelled.',
				'November 2021 grade boundaries do not exist because I cannot find them. If you have them, please contact me and I will add them to the website. '
			]}
		/>

		<br />
	</div>
</div>

<style>
	.content {
		margin: 20px 18%;
	}

	p {
		line-height: 2;
	}

	@media screen and (max-width: 480px) {
		.content {
			margin: 0 10px;
		}
	}
</style>
