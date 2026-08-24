---
title: 'How IB Predict forecasts grade boundaries'
description: 'The data, weighting, uncertainty ranges, and limitations behind our experimental examination-session forecasts.'
slug: 'ib-predict-boundary-forecast-methodology'
date: '2026-08-14'
---

IB Predict's grade-boundary forecast is an experimental estimate, not an official IB grade boundary. It is designed to turn the historical boundary record into a transparent range of plausible outcomes for the next examination session.

## What the forecast answers

For each grade, the model estimates:

- a predicted minimum mark;
- an 80% likely range around that mark; and
- a confidence label based on the amount and consistency of the available history.

When a student enters assessment marks, those predicted thresholds are also used to estimate the most likely grade and the next most likely outcome. These percentages describe uncertainty in the future boundary. They are not a prediction of an individual student's exam-day performance.

## Choosing comparable sessions

November forecasts are trained only on past November sessions. May and November cohorts can behave differently, so the model does not mix them.

The model also ignores results from before the current subject syllabus began. If several time zones were published for one session, their boundaries are combined into a single session-level value before the trend is calculated. The spread between time zones still contributes to the uncertainty range.

At least three comparable sessions are required before a forecast is shown.

### TOK and Extended Essay

TOK and Extended Essay are handled differently from standard subjects. Their current published cutoffs are normally stable across examination sessions, so IB Predict carries the latest published thresholds forward without adding artificial year-to-year uncertainty. The displayed grade probability is therefore deterministic: a score at or above a cutoff receives that grade with 100% probability. Users can still select an official M25 or N25 boundary when they want to inspect a named session directly.

## Weighting history and trend

Recent sessions receive more weight than older sessions. The weight declines by 28% for every year of age, which lets the estimate respond to current conditions without discarding longer-term history.

November 2020 through November 2022 receive 35% of their normal weight because COVID-era assessment conditions and boundaries were unusually different from standard sessions.

The final point estimate blends:

- 70% recency-weighted historical average; and
- 30% recency-weighted trend.

The trend is capped at two marks per year in either direction. Grade thresholds are then constrained to remain in the correct order, so a higher grade cannot have a lower predicted threshold than the grade below it.

## Building the uncertainty range

The 80% likely range is intentionally wider when the evidence is less stable. Its width uses the largest of:

- rolling backtest error;
- 65% of historical standard deviation;
- the average half-range between time zones; or
- a minimum allowance of two marks.

The range is capped at 12 marks on either side of the point estimate. This keeps a small or volatile dataset from creating a misleadingly precise forecast while preventing an unusably broad range.

## Backtesting

The model uses rolling backtests. For each historical session after the first three, it trains only on the sessions that would have been available at that time and predicts the next result. The displayed backtest error is the mean absolute difference between those predictions and the published boundaries.

Confidence labels use the number of sessions, backtest error, and interval width together:

- **High:** at least eight sessions, no more than 2.5 marks of mean backtest error, and a likely-range half-width of no more than four marks.
- **Medium:** at least four sessions, no more than 4.5 marks of mean backtest error, and a half-width of no more than seven marks.
- **Low:** anything with less history or more variation.

## Turning boundaries into grade likelihoods

For a student's calculated percentage, the compact probability display answers a more concrete question: **what grade would this score have earned across comparable published session and timezone boundaries from the current syllabus?** Each post-COVID November boundary receives a weight of 6, each post-COVID May boundary receives a weight of 3, and transitional evidence receives a weight of 1. It displays the weighted result for the forecasted grade, one grade below, and one grade above. For example, if 81% earned a Grade 7 under every comparable published boundary, the card shows Grade 7 at 100%.

This weighted historical result is intentionally separate from the November 2026 cutoff estimate. It shows how consistently the score performed against the most relevant evidence we have; it is not a guarantee that the unpublished boundary will be identical.

The compact card shows the forecasted grade and its adjacent grades. The expanded details highlight the two outcomes seen most often in the published history.

## Limitations

No historical model can know the difficulty of an unpublished paper, changes in candidate performance, moderation decisions, or future IB policy. Subjects with few November candidates or limited comparable history are especially uncertain. Published boundaries should always replace forecasts as soon as they are available.

The current implementation is model version 1.0 and uses published data through November 2025 for the November 2026 forecast.
