<script>
    import { selectedGroup6, gradeBoundary } from "./store.js";
    import Group1 from "./group1.svelte";
    import Group2 from "./group2.svelte";
    import Group3 from "./group3.svelte";
    import Group4 from "./group4.svelte";
    import Group5 from "./group5.svelte";
    import Group6 from "./group6.svelte";
    import TOK from "./TOK.svelte";
    import DetailedTable from "./detailedTable.svelte";
    import SelectedGroup6 from "./selectedGroup6.svelte";
    import GradeBoundary from "./gradeboundary.svelte";

    let scores = [];
    let totalScore;
    let tokGrade;
    let eeGrade;
    let corePoints;

    let HLCount = 0,
        SLCount = 0;
    let levels = [];

    // Count HL and SL subjects
    $: {
        (HLCount = 0), (SLCount = 0);
        levels.forEach((item) => {
            item == "HL" ? HLCount++ : item == "SL" && SLCount++;
        });
    }

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
        International Baccalaureate Diploma Programme <br /> <br /> Predicted Score
        Calculator
    </h1>
</div>
<div class="intro">
    <h2>Welcome to IB Predict!</h2>
    <p>
        Our primary aim is to assist IB Diploma Programme students in calculating
        their final IB grade accurately. We understand the significance of
        score predictions when it comes to university applications. Our IB predicted grade calculator has been designed to take into account various
        factors such as your performance in internal assessments and historical data from previous IB students, our
        calculator strives to generate reliable predictions.
    </p>
    <p>
        The IB scoring system is complex, and individual performance can vary.
        Factors such as external exam conditions, personal circumstances, and
        other variables can influence actual scores.
    </p>
    <p>
        NOTE: For a given subject, if there is more than one timezone, the one
        with a stricter grading system (more challenging mark band) will be
        applied.
    </p>
    <p>
        NOTE: Subjects with fewer than 100 candidates do not have published
        boundaries. Therefore, you will have to rely on mocks and teacher
        predictions for guidance.
    </p>

    <div class="multipleChoice">
        <SelectedGroup6 />
        <GradeBoundary />
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
        <Group1
            bind:awardedMark={scores[0]}
            bind:level={levels[0]}
        />
        <Group2
            bind:awardedMark={scores[1]}
            bind:level={levels[1]}
        />
        <Group3
            bind:awardedMark={scores[2]}
            bind:level={levels[2]}
        />
        <Group4
            bind:awardedMark={scores[3]}
            bind:level={levels[3]}
        />
        <Group5
            bind:awardedMark={scores[4]}
            bind:level={levels[4]}
        />
        {#if $selectedGroup6 == "6"}
            <Group6
                bind:awardedMark={scores[5]}
                bind:level={levels[5]}
            />
        {:else if $selectedGroup6 == "1"}
            <Group1
                bind:awardedMark={scores[5]}
                bind:level={levels[5]}
                groupNumber="6"
            />
        {:else if $selectedGroup6 == "2"}
            <Group2
                bind:awardedMark={scores[5]}
                bind:level={levels[5]}
                groupNumber="6"
            />
        {:else if $selectedGroup6 == "3"}
            <Group3
                bind:awardedMark={scores[5]}
                bind:level={levels[5]}
                groupNumber="6"
            />
        {:else if $selectedGroup6 == "4"}
            <Group4
                bind:awardedMark={scores[5]}
                bind:level={levels[5]}
                groupNumber="6"
            />
        {/if}
        <TOK bind:awardedMark={tokGrade} bind:ee={eeGrade} bind:corePoints />
    </div>
    <div class="right-column">
        <div class="data">
            <div class="table">
                <DetailedTable
                    points={totalScore}
                    awardedMarks={scores}
                    tok={tokGrade}
                    ee={eeGrade}
                    {levels}
                    {HLCount}
                    {SLCount}
                    {corePoints}
                    {gradeBoundary}
                />
            </div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="light.css" />

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
        font-family: cursive;
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

    @media screen and (max-width: 560px) {
        .layout {
            display: block;
        }
        footer {
            display: block;
            height: 450px;
        }
        .banner {
            height: 300px;
        }
    }
</style>
