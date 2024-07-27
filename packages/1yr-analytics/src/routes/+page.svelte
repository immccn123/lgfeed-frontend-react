<script lang="ts">
	import day24hData from "$lib/analytics/day24h.json";
	import "chart.js/auto";

	import { Chart, Line } from "svelte-chartjs";

	let beginDate, endDate;

	$: data = {
		labels: day24hData.map((x) =>
			new Date(x.date.slice(0, -1) + "+08:00").toLocaleString(),
		),
		datasets: [
			{
				label: "Benben per 24h",
				fill: true,
				lineTension: 0.3,
				backgroundColor: "rgba(225, 204,230, .3)",
				borderColor: "rgb(205, 130, 158)",
				borderDash: [],
				borderDashOffset: 0.0,
				pointBorderColor: "rgb(205, 130,1 58)",
				pointBackgroundColor: "rgb(255, 255, 255)",
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgb(0, 0, 0)",
				pointHoverBorderColor: "rgba(220, 220, 220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 0,
				pointHitRadius: 10,
				data: day24hData.map((x) => x.count),
			},
		],
	};
</script>

<div class="chart-container">
	<Line {data} options={{ responsive: true, animation: false }} />
</div>

<style>
	.chart-container {
		width: 2500px;
	}
</style>
