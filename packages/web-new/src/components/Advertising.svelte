<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import chance from 'chance';

	const items = chance(new Date().toDateString()).shuffle([
		{
			src: '/advertising.webp',
			alt: '广告位招租',
			href: 'https://qm.qq.com/q/f2Wp6MF5lu'
		},
		{
			src: 'https://static.imken.moe/bensite-advertising/blikznxt-exp20241130.webp',
			alt: 'Ad by 501947',
			href: 'https://www.luogu.com.cn/user/727558'
		},
		{
			src: 'https://static.imken.moe/bensite-advertising/7-365654-exp241231.png',
			alt: 'Sleeping Cup - by 365654',
			href: 'http://8.136.99.126'
		}
	]);

	let activeItem = 0;
	let interval: number | NodeJS.Timeout;

	function switcher() {
		activeItem = (activeItem + 1) % items.length;
	}

	function resetInterval() {
		if (interval) clearInterval(interval);
		interval = setInterval(switcher, 5000);
		console.log(activeItem);
	}

	onMount(() => {
		resetInterval();
	});
</script>

<div class="carousel w-full">
	{#each items as item, index (item.src + index)}
		{#if index === activeItem}
			<div
				class="carousel-item sticky left-0 top-0 w-full"
				out:fade={{ duration: 100 }}
				in:fade={{ delay: 100 }}
			>
				<a href={item.href} target="_blank" rel="nofollow noreferrer noopener">
					<img src={item.src} alt={item.alt} class="w-full" />
				</a>
			</div>
		{/if}
	{/each}
</div>
<!-- 每 24h 随机打乱一次！ -->
<div class="flex w-full justify-center gap-2 py-2">
	{#each items as _, index}
		<a
			href="?"
			on:click|preventDefault={() => ((activeItem = index), resetInterval())}
			class="btn btn-xs {activeItem === index && 'btn-primary'}"
		>
			{index + 1}
		</a>
	{/each}
</div>
