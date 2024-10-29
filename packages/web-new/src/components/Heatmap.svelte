<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { systemPrefersMode } from 'mode-watcher';
	export let data: API.Heatmap = [];

	let container: HTMLDivElement;

	const margin = { top: 20, right: 20, bottom: 20, left: 40 };
	const cellSize = 15;
	const width = 53 * cellSize;
	const height = 7 * cellSize;

	$: colorScale = ($systemPrefersMode === 'light'
		? ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
		: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'])

	onMount(() => {
		systemPrefersMode.subscribe(() => {
			container.innerHTML = '';
			drawHeatmap();
		});
	});

	const getColor = (count: number) => {
		return colorScale[countMap(count)]
	}

	const countMap = (count: number) => {
		if (count >= 50) return 3;
		if (count >= 20) return 2;
		if (count >= 5) return 1;
		return 0;
	};

	function drawHeatmap() {
		if (!data.length) return;

		const parseDate = d3.timeParse('%Y-%m-%d');
		const dates = data.map((d) => parseDate(d.date)!);
		const minDate = d3.min(dates)!;
		const maxDate = d3.max(dates)!;

		const weekDay = d3.timeFormat('%w');

		const weekIndex = (date: Date) => {
			const week = d3.timeWeek.count(minDate, date);
			return week < 0 ? 0 : week;
		};

		const svg = d3
			.select(container)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const tooltip = d3
			.select(container)
			.append('div')
			.style('position', 'fixed')
			.style('visibility', 'hidden')
			.style('background', '#333')
			.style('color', '#fff')
			.style('padding', '5px')
			.style('border-radius', '5px')
			.style('font-size', '12px');

		svg.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('x', (d) => weekIndex(parseDate(d.date)!) * cellSize)
			.attr('y', (d) => +weekDay(parseDate(d.date)!) * cellSize)
			.attr('width', cellSize - 1)
			.attr('height', cellSize - 1)
			.attr('fill', (d) => getColor(d.count))
			.style('stroke', $systemPrefersMode === "light" ? 'white' : "black")
			.on('mouseover', function (_, d) {
				tooltip.style('visibility', 'visible').html(`Date: ${d.date}<br>Count: ${d.count}`);
				// d3.select(this).style('stroke', 'black').style('opacity', 1);
			})
			.on('mousemove', (e) => {
				tooltip.style('top', `${e.pageY + 5}px`).style('left', `${e.pageX + 5}px`);
			})
			.on('mouseout', function () {
				tooltip.style('visibility', 'hidden');
				// d3.select(this).style('stroke', 'none');
			});

		const months = d3.timeMonths(minDate, maxDate);

		svg.selectAll('months')
			.data(months)
			.enter()
			.append('text')
			.attr('fill', $systemPrefersMode === 'dark' ? '#fff' : '#000')
			.attr('x', (d) => weekIndex(d) * cellSize)
			.attr('y', -5)
			.attr('text-anchor', 'start')
			.text((d) => d3.timeFormat('%b')(d));

		svg.selectAll('weekday')
			.data(['Mon', 'Wed', 'Fri'])
			.enter()
			.append('text')
			.attr('x', -5)
			.attr('y', (_, i) => (i * 2 + 1) * cellSize + 12)
			.attr('fill', $systemPrefersMode === 'dark' ? '#fff' : '#000')
			.attr('text-anchor', 'end')
			.attr('font-size', 'small')
			.text((x) => x);
	}
</script>

<div class="overflow-x-auto" bind:this={container}></div>
