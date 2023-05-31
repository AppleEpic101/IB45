<script>
    export let courses;
    export let awardedMarks;

    let defined = courses !== undefined && awardedMarks !== undefined;
    $: console.log(awardedMarks);
</script>

<table>
    <tr>
        <th>Subject</th>
        <th>Awarded Mark</th>
    </tr>
    {#if defined}
        <tr>
            <td>{courses[0]}</td>
            <td>{awardedMarks[0]}</td>
        </tr>
        <tr>
            <td>{courses[1]}</td>
            <td>{awardedMarks[1]}</td>
        </tr>
        <tr>
            <td>{courses[2]}</td>
            <td>{awardedMarks[2]}</td>
        </tr>
        <tr>
            <td>{courses[3]}</td>
            <td>{awardedMarks[3]}</td>
        </tr>
        <tr>
            <td>{courses[4]}</td>
            <td>{awardedMarks[4]}</td>
        </tr>
        <tr>
            <td>{courses[5]}</td>
            <td>{awardedMarks[5]}</td>
        </tr>
    {/if}
</table>

<style>
    table, tr, th, td {
        border: 2px solid black;
    }
</style>