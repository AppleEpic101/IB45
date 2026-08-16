<script>
	import Collapsible from '$lib/components/collapsible.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<PageHeader
	title="Frequently Asked Questions"
	description="Answers to common questions about IB Predict, grade boundaries, and the diploma calculator."
/>

<main class="faq-page">
	<header class="intro">
		<p class="eyebrow">Help center</p>
		<h1>Frequently asked questions</h1>
		<p class="intro-copy">
			Clear answers about our data, grade predictions, and using the calculator.
		</p>
		<p class="contact-copy">
			Can’t find what you need? <a href="mailto:admin@ibpredict.org">Send us a question</a> or
			<a href="https://discord.gg/G8UvbTJHp8" target="_blank" rel="noreferrer">ask the community</a
			>.
		</p>
	</header>

	<section class="questions" aria-label="Frequently asked questions">
		<Collapsible question="Are these grade boundaries real/legit?">
			<p>Yes. These are official grade boundaries from past examinations.</p>
		</Collapsible>

		<Collapsible question="Is this calculator accurate?">
			<p>
				The calculator applies your marks to the selected published boundary. That calculation is
				exact, but future boundaries can change. Treat a result near the next boundary as less
				certain, especially for a recently updated course with little history.
			</p>
		</Collapsible>

		<Collapsible
			question="Why does the calculator predict a different grade than my official predicted grade?"
		>
			<p>
				Your IB Predicted Grade is determined by your teacher (e.g. performance in class, mock
				exams). Your final exam is determined by your performance on the actual IB exams. The latter
				is what IB Predict is trying to predict. The calculator is not meant to replace your
				official predicted grade, but rather to give you an idea of how you might perform on the
				final exam based on your current performance.
			</p>
		</Collapsible>

		<Collapsible question="When will grade boundaries be posted for the latest exam session?">
			<p>
				September for May examinations and March for November examinations. This is because the IB
				takes a while to release grade boundaries, and I have to wait until they are released before
				I can update the website. If you get them before I do, please send it to me.
			</p>
		</Collapsible>

		<Collapsible question="Why is the Boundary Not Found?">
			<ul>
				<li>
					If you are using a November grade boundary, it is likely because the subject was very
					unpopular. Subjects that do not garner enough candidates (more than 100) do not have
					available grade boundary data. Please refer to the individual grade boundary calculator by
					clicking "More details".
				</li>
				<li>
					Analysis And Approaches and Applications And Interpretation were introduced in 2021. Data
					from before 2021 cannot be found for these subjects because it did not exist.
				</li>
				<li>
					Music was revised in 2022. SL Music cannot be found in data before 2022 because it did not
					exist.
				</li>
			</ul>
		</Collapsible>

		<Collapsible question="Why is the table indicating that the diploma is not awarded?">
			<p>
				The following are the only reasons for why the diploma was not awarded (pay attention to
				wording such as 'at least', 'less than', or 'less than or equal to'):
			</p>
			<ul>
				<li>You have not selected 6 subjects in the calculator</li>
				<li>You have less than 24 total points</li>
				<li>You scored an E in TOK</li>
				<li>You scored an E on the Extended Essay</li>
				<li>You don't have either 3 or 4 HL subjects selected</li>
				<li>You scored at least single 1 on any subject</li>
				<li>You scored more than two 2s on any subjects</li>
				<li>You scored more than three 3s on any subjects</li>
				<li>The sum of the scores of your HL subjects is less than 12</li>
				<li>You take 3 SL subjects and the sum of the scores of your SL subjects is less than 9</li>
				<li>
					You take 2 SL subjects (consequently 4 HL subjects) and the sum of the scores of your SL
					subjects is less than 5
				</li>
			</ul>
		</Collapsible>

		<Collapsible question="How do I replace my Group 6 subject with a subject from Groups 1-5?">
			<p>
				Very simple. Navigate to the Group 6 component of the home page. Then, click the first of
				three dropdowns and select the alternate group number. The second dropdown is the subject
				name and it will have changed to reflect the new group.
			</p>
		</Collapsible>

		<Collapsible
			question="I am pursuing an IB Bilingual Diploma. How do I select multiple Language A subjects?"
		>
			<p>
				A bilingual diploma is awarded when a mark of 3 or higher is achieved in at least two Group
				1 subjects (excluding Literature And Performance; correct me if I am wrong). The second
				Group 1 subject may be selected under Group 2. You may even select a third by replacing your
				Group 6 with a Group 1 subject.
			</p>
		</Collapsible>

		<Collapsible question="How does the calculator work?">
			<p>
				Each assessment counts according to its official course weight. IB Predict combines those
				marks into a score out of 100, rounds it to the nearest whole number, and checks where it
				falls in the selected grade boundary.
			</p>
			<p><a href="/blog/understanding-your-ib-predict-results">Read the results guide</a>.</p>
		</Collapsible>

		<Collapsible question="What do ‘Ahead of’ and ‘Grade outlook’ mean?">
			<p>
				“Ahead of” is a rounded comparison with published grades from that exam session, not an
				exact personal rank. “Grade outlook” explains whether that score kept the same grade under
				comparable past boundaries and how much a higher boundary could change the result. Both are
				context for planning, not official rankings or guaranteed results.
			</p>
			<p>
				<a href="/blog/understanding-your-ib-predict-results">See examples in the results guide</a>.
			</p>
		</Collapsible>

		<Collapsible question="What does the experimental boundary forecast mean?">
			<p>
				When enough history is available, the subject calculator opens on N26 Forecast. The grade,
				marks to the next grade, and boundary table all use that one estimate. It predicts future
				boundaries, not your exam-day marks.
			</p>
			<p>
				Choose an M25 or N25 option in the session bar to use an official published boundary
				instead. The forecasted-grade and adjacent-grade probabilities show how often your score
				earned each result across comparable published boundaries; “Beats X% of N25 test takers”
				uses published November 2025 results. Open the forecast details only if you want possible
				ranges and model checks, or read
				<a href="/blog/ib-predict-boundary-forecast-methodology">the forecast methodology</a>.
			</p>
			<p>
				TOK and Extended Essay use their latest stable published cutoffs without added uncertainty,
				so reaching a cutoff shows that grade at 100%.
			</p>
		</Collapsible>

		<Collapsible question="Where are the [BLANK] grade boundaries?">
			<ul>
				<li>
					Only grade boundaries from May 2019 to present are offered. If you would like past grade
					boundaries to be included and have a good reason for it, please contact me.
				</li>
				<li>May 2020 grade boundaries do not exist because examinations were cancelled.</li>
				<li>
					November 2021 grade boundaries do not exist because I cannot find them. If you have them,
					please contact me and I will add them to the website.
				</li>
			</ul>
		</Collapsible>

		<Collapsible question="Which exam session and timezone should I choose?">
			<p>
				Choose the session and boundary variant supplied with your examination paper, mark scheme,
				or results. A TZ number describes a paper variant, not your device or local clock, and it
				should not be treated as a permanent regional map. Ask your programme coordinator when the
				label is unclear.
			</p>
			<p>
				<a href="/blog/choosing-an-ib-exam-session-and-timezone"
					>Read the session and timezone guide</a
				>.
			</p>
		</Collapsible>
	</section>
</main>

<style>
	.faq-page {
		width: min(800px, calc(100% - 40px));
		margin: 0 auto;
		padding: 72px 0 96px;
	}

	.intro {
		max-width: 680px;
		padding-bottom: 48px;
	}

	.eyebrow {
		margin: 0 0 14px;
		color: var(--color-text-muted);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		color: var(--color-text-main);
		font-size: clamp(2.25rem, 6vw, 3.4rem);
		font-weight: 750;
		letter-spacing: -0.045em;
		line-height: 1.05;
	}

	.intro-copy {
		margin: 18px 0 0;
		color: var(--color-text-muted);
		font-size: 1rem;
		line-height: 1.65;
	}

	.contact-copy {
		margin: 20px 0 0;
		color: var(--color-text-muted);
		font-size: 0.86rem;
		line-height: 1.7;
	}

	.contact-copy a {
		color: var(--color-text-main);
		font-weight: 600;
		text-decoration: underline;
		text-decoration-color: var(--color-border);
		text-underline-offset: 3px;
	}

	.questions {
		border-top: 1px solid var(--color-border);
	}

	.questions :global(p),
	.questions :global(li) {
		color: var(--color-text-muted);
		font-size: 0.94rem;
		line-height: 1.75;
	}

	.questions :global(p) {
		margin: 0;
	}

	.questions :global(ul) {
		margin: 0;
		padding-left: 1.25rem;
	}

	.questions :global(li + li) {
		margin-top: 0.55rem;
	}

	@media (max-width: 640px) {
		.faq-page {
			width: min(100% - 32px, 800px);
			padding: 52px 0 72px;
		}

		.intro {
			padding-bottom: 36px;
		}
	}
</style>
