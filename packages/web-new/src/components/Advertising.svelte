<script lang="ts">
	import { fade } from 'svelte/transition';

	let activeItem = 0;

	const items = [
		{
			src: '/advertising.webp',
			alt: '广告位招租',
			href: 'https://qm.qq.com/q/f2Wp6MF5lu'
		}
	];
</script>

<div class="carousel w-full">
	{#each items as item, index (item.src + index)}
		{#if index === activeItem}
			<div
				class="carousel-item sticky left-0 top-0 w-full"
				out:fade={{ duration: 100 }}
				in:fade={{ delay: 100 }}
			>
				<a href={item.href}> <img src={item.src} alt={item.alt} class="w-full" /> </a>
			</div>
		{/if}
	{/each}
</div>
<div class="flex w-full justify-center gap-2 py-2">
	{#each items as _, index}
		<a
			href="?"
			on:click|preventDefault={() => (activeItem = index)}
			class="btn btn-xs {activeItem === index && 'btn-primary'}"
		>
			{index + 1}
		</a>
	{/each}
</div>
