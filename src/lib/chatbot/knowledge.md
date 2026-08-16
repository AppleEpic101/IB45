# IB Predict Knowledge Base

## What is IB Predict?

IB Predict (ibpredict.org) is the #1 free IB DP Predicted Score Calculator for students and teachers.
Launched June 2023, 1,000,000+ users. Users select their courses via dropdowns for Groups 1
through 6 plus TOK+EE, enter assessment scores, and the results table shows total points, detailed
point distribution, and diploma status. It uses officially released IB grade boundaries (May 2019
to present). Data is saved to local storage for convenience. Works on desktop and mobile.

Contact / feedback / corrections: admin@ibpredict.org

## Site map (pages you can link users to)

- `/` — Home: the main predicted score calculator (Groups 1–6, TOK+EE, results table)
- `/subjects` — List of all subject pages
- `/subjects/<name>` — Individual subject page: assessment score entry, predicted grade, grade planning, global grade distributions, and focused historical boundaries
- `/grade-boundaries` — Grade boundaries overview
- `/grade-boundaries/<name>` — Grade boundary tables for a specific subject
- `/faq` — Frequently asked questions
- `/about` — About the team
- `/blog` — Blog posts
- `/changelog` — Site updates

## Supported subject pages

Language & Literature (`/subjects/language-and-literature`), Literature (`/subjects/literature`),
Language B (`/subjects/language-b`), AB Initio (`/subjects/ab-initio`),
Business Management (`/subjects/business-management`), Economics (`/subjects/economics`),
History (`/subjects/history`), Psychology (`/subjects/psychology`), Biology (`/subjects/biology`),
Chemistry (`/subjects/chemistry`), Physics (`/subjects/physics`),
ESS (`/subjects/environmental-systems-and-societies`),
Math AA (`/subjects/analysis-and-approaches`), Math AI (`/subjects/applications-and-interpretation`),
Visual Arts (`/subjects/visual-arts`), TOK (`/subjects/theory-of-knowledge`),
EE (`/subjects/extended-essay`).

## How the calculator works

Your score out of 100 combines the entered assessment marks using each component's official
course weight, then rounds the result to the nearest integer. A 1–7 grade is assigned by checking
that score against the selected grade boundary. TOK and EE are graded A–E and combine via the
standard IB matrix for up to 3 bonus points, for a maximum total of 45.

## How to explain results

Lead with the predicted grade, score out of 100, marks to the next grade, and one useful next
action. Explain “Ahead of” as a rounded, approximate comparison with students in the selected
session, never as an exact rank. Use the phrase “grade outlook” and a plain sentence about what a
higher boundary would do.

Do not introduce standard deviation, backtest error, confidence categories, training data, or
other model diagnostics unless the user asks for technical detail. Link users to
`/blog/understanding-your-ib-predict-results` for result explanations and
`/blog/ib-predict-boundary-forecast-methodology` for forecast methodology.

## FAQ

**Are these grade boundaries real?** Yes — official grade boundaries from past examinations.

**Is the calculator accurate?** Assume yes with good judgement. Boundaries vary year to year, so
borderline results could go either way. For new courses (e.g. new 2025 sciences), it's an
approximation based on the old curriculum.

**Why does it differ from my official predicted grade?** Your official IB Predicted Grade is
determined by your teacher (class performance, mocks). IB Predict estimates your performance on
the actual final exams — it complements, not replaces, your official predicted grade.

**When are new grade boundaries posted?** September for May sessions, March for November sessions
(after the IB releases them). Site is updated after every exam session.

**Why is a Boundary Not Found?**

- November boundaries: subjects with fewer than ~100 candidates have no published boundary data — use the individual subject page ("More details").
- Math AA and Math AI were introduced in 2021 — no data before 2021.
- SL Music was revised in 2022 — no data before 2022.

**Why do certain boundaries not exist?**

- Only May 2019 to present is offered.
- May 2020 does not exist — exams were cancelled (COVID).
- November 2021 boundaries could not be sourced — email if you have them.

**Why does it say the diploma is not awarded?** Failing conditions:

- Fewer than 6 subjects selected
- Fewer than 24 total points
- An E in TOK or the Extended Essay
- Not exactly 3 or 4 HL subjects
- Any grade of 1
- More than two 2s, or more than three 3s
- HL subject scores sum to less than 12
- With 3 SL subjects: SL scores sum to less than 9; with 2 SL subjects (4 HL): SL sum less than 5

On the main calculator, lead with the total diploma points and diploma-status message. The six
subject grades, TOK, EE, and core points are available under **Subject & core breakdown**. Do not
list every row unless the user asks for the breakdown or needs help finding a failing condition.

The full TOK/Extended Essay core-points matrix is under **How TOK and EE combine** on either core
subject page. Explain the student's specific combination first; only reproduce the full matrix when
they ask for every combination.

**How do I replace my Group 6 subject with one from Groups 1–5?** On the home page, in the Group 6
component, use the first of the three dropdowns to pick the alternate group; the subject dropdown
updates to match.

**Bilingual Diploma / multiple Language A subjects?** A bilingual diploma requires a 3+ in at least
two Group 1 subjects (excluding Literature and Performance). Select the second Group 1 subject
under Group 2, and optionally a third by replacing Group 6.

**Forecast details:** Subject pages show experimental future-boundary estimates based on comparable
past sessions. The headline assumes the student's current score stays the same; it estimates how
that score would fare if the future boundary changed. It does not predict the student's exam-day
performance. Do not repeat the forecast headline in a separate explanation. Technical model checks
are optional and should be discussed only when the user asks.

In the predicted-mark card, **Weighted score** is the combined percentage for a standard subject.
**To Grade X** is the remaining weighted-mark gap to the next published boundary. TOK and EE show
their score out of 30 or 34. Do not call the weighted score itself the student's grade.

The grade-distribution table follows the season selected in the chart (May or November) so the
default rows match the visual. **All Sessions** combines both seasons and should be suggested only
when the user wants a broader comparison.

In the grade-distribution chart, each bar is the published share of students receiving that grade.
The student's predicted-grade bar is outlined in blue, while the session average is written above
the chart. Do not describe nonexistent average or student marker lines.

**Is my data saved?** Yes, inputs are saved in your browser's local storage automatically. Nothing
is sent to a server.
