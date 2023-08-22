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
	<a href="./subjects">Subjects</a>
	<a href="./changelog">Changelog</a>
</div>

<style>
	.top-links {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-right: 5px;
		width: 100%;
	}

	.top-links a {
		margin-right: 10px;
		margin-left: 20px;
		color: black;
		text-decoration: none;
		font-size: 1.2em;
	}

	img {
		width: 150px;
		height: 75px;
		/* min-height: 75px;
		min-width: 150px; */
		cursor: pointer;
		align-self: flex-start;
		margin-left: 5px;
		transition: 0.3s ease-in-out;
	}

	img:hover {
		transform: scale(1.05);
		-webkit-transform: scale(1.05);
	}

	@media screen and (max-width: 560px) {
		.top-links a {
			margin-right: 5px;
			margin-left: 10px;
			color: black;
			text-decoration: none;
			font-size: 0.8em;
		}
	}

	@media screen and (max-width: 360px) {
		img {
			width: 100px;
			height: 50px;
		}
	}
</style>
