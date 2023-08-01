<nav>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
        src="flc_design20230531154582.png"
        alt="Logo"
        on:click={() => {
            location.reload();
        }}
    />
    <div class="top-links">
        <a href="/">Home</a>
        <!-- <a href="./About">About</a> -->
    </div>
</nav>

<slot />

<footer>
    <div>
        <strong>THE SYNDICATE</strong><br />Alexander Du<br />Winston Thov<br
        />Richard Yang
    </div>
    <div class="title">
        <strong>RESOURCES</strong><br />
        <a href="May 2019 Grade Boundaries.pdf" target="_blank"
            >May 2019 Grade Boundary</a
        ><br />
        <a href="May 2022 Grade Boundaries.pdf" target="_blank"
            >May 2022 Grade Boundary</a
        ><br />
        <a href="November 2022 Grade Boundaries.pdf" target="_blank"
            >November 2022 Grade Boundary</a
        >
    </div>
    <div>
        <strong>CONTACT</strong><br />Report errors, ask questions, etc.<br
        />admin@ibpredict.com
    </div>
</footer>

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

    footer {
        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        background-color: var(--primary);
        height: 200px;
        border-top: 1px solid black;
    }

    footer div {
        text-align: center;
        line-height: 2;
    }

    footer div::before {
        content: "\A";
        white-space: pre;
    }

    nav img {
        width: 150px;
        height: 75px;
        cursor: pointer;
        align-self: flex-start;
        margin-left: 5px;
        transition: 0.3s ease-in-out;
    }

    nav img:hover {
        transform: scale(1.05);
        -webkit-transform: scale(1.05);
    }
</style>