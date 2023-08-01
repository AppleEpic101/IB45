<script>
    import { gradeBoundary, group3, group6 } from "$lib/stores/store.js";
    import Slider from "./slider.svelte";
    import data from "$lib/assets/courses.json";
    import gradeBoundaryM19 from "$lib/assets/Grade_BoundariesM19";
    import gradeBoundaryM22 from "$lib/assets/Grade_BoundariesM22";
    import gradeBoundaryN22 from "$lib/assets/Grade_BoundariesN22";

    let subjects = [
        "Business Management",
        "Economics",
        "Environmental Systems And Societies",
        "Geography",
        "Global Politics",
        "History",
        "Information Technology In A Global Society",
        "Philosophy",
        "Psychology",
        "Social And Cultural Anthropology",
        "World Religions"
    ];
    let SLOnly = ["Environmental Systems And Societies", "World Religions"];

    let regions = [
        "Africa And Middle East",
        "Americas",
        "Asia And Oceania",
        "Europe"
    ];

    let boundary = [];
    let boundaries;

    let courses = Object.keys(data).map((courseName) => ({
        name: courseName,
        assessments: data[courseName].assessments
    }));

    $: {
        if ($gradeBoundary == "M19") {
            boundaries = Object.keys(gradeBoundaryM19).map((courseName) => ({
                name: courseName,
                TZ: gradeBoundaryM19[courseName].TZ
            }));
        } else if ($gradeBoundary == "M22") {
            boundaries = Object.keys(gradeBoundaryM22).map((courseName) => ({
                name: courseName,
                TZ: gradeBoundaryM22[courseName].TZ
            }));
        } else {
            boundaries = Object.keys(gradeBoundaryN22).map((courseName) => ({
                name: courseName,
                TZ: gradeBoundaryN22[courseName].TZ
            }));
        }
        boundary = [];
    }

    export let groupNumber = 3;
    let shortName;
    let grade;
    let fullName;
    export let awardedMark;

    let store = groupNumber == 6 ? JSON.parse($group6) : JSON.parse($group3);
    $: {
        if (groupNumber == 6) $group6 = JSON.stringify(store);
        else $group3 = JSON.stringify(store);
    }

    $: sufficientInformation = !(
        (shortName == "HL History" && store.region == "") ||
        store.name == "" ||
        store.level == ""
    );
    $: shortName = store.level + " " + store.name;
    $: fullName = store.level + " " + store.name + " " + store.region;
    $: {
        grade = 0;
        if (matchedCourse !== undefined) {
            matchedCourse.assessments.forEach((assessment, i) => {
                grade +=
                    (store.sliderPosition[i] / assessment.maxMarks) *
                    assessment.weight *
                    100;
            });
        }

        grade = Math.round(grade);
    }

    $: matchedCourse = courses.find((course) => course.name === shortName);
    $: match = boundaries.find((course) => course.name === fullName.trim());

    $: {
        // calculate grade boundary
        if (match !== undefined) {
            match.TZ.forEach((arr, i) => {
                boundary[i] = 0;
                arr.forEach((element) => {
                    if (grade >= element) {
                        boundary[i]++;
                    }
                });
            });
        }
    }
    $: {
        if (store.name === "History" && store.level === "SL" || store.name !== "History") store.region = "";
    }

    $: {
        if (SLOnly.includes(store.name) && store.level == "HL") store.level = "SL";
    }

    $: awardedMark = boundary.length > 0 ? Math.min(...boundary) : 0;
    $: if (!matchedCourse || !match) awardedMark = 0;

    function reset() {
        if (matchedCourse !== undefined)
            store.sliderPosition = matchedCourse.assessments.map((assessment) =>
                Math.trunc(assessment.maxMarks / 2)
            );
    }
</script>

<div class="group">
    <h2>
        {#if !sufficientInformation}
            Group {groupNumber}: Individuals And Societies
        {:else}
            {fullName}
        {/if}
    </h2>
    <select bind:value={store.name} on:change={reset}>
        <option value="">Enter subject</option>
        {#each subjects as subject}
            <option value={subject}>{subject}</option>
        {/each}
    </select>

    <select bind:value={store.level} on:change={reset}>
        <option value="">Enter level</option>
        {#if !SLOnly.includes(store.name)}
            <option value="HL">HL</option>
        {/if}
        <option value="SL">SL</option>
    </select>

    {#if store.name === "History" && store.level === "HL"}
        <select bind:value={store.region} on:change={reset}>
            <option value="">Enter HL History region</option>
            {#each regions as r}
                <option value={r}>{r}</option>
            {/each}
        </select>
    {/if}

    <div class="content">
        {#if sufficientInformation && matchedCourse}
            {#each matchedCourse.assessments as assessment, i}
                <Slider
                    max={assessment.maxMarks}
                    name={assessment.name}
                    weight={assessment.weight}
                    bind:value={store.sliderPosition[i]}
                />
            {/each}
        {/if}
    </div>
    <div class="stats">
        {#if sufficientInformation}
            Grade: {grade} / 100
            {#if match}
                <div>
                    {$gradeBoundary}&nbsp;&nbsp;&nbsp;&nbsp;
                    {#if boundary.length == 1}
                        Timezone 0: {boundary[0]}
                    {:else}
                        {#each boundary as b, i}
                            Timezone {i + 1}: {b} &nbsp&nbsp&nbsp&nbsp
                        {/each}
                    {/if}
                </div>
                Awarded Mark: {awardedMark}
            {:else}
                <h4>Boundary Not Found.</h4>
            {/if}
        {:else}
            <h4>Please provide more details</h4>
        {/if}
    </div>
</div>
