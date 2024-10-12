<script lang="ts">
	import { page } from '$app/stores';

	$: pathname = $page.url.pathname;

	export let to: string | undefined = undefined;
	export let title = false;
	export let fullMatch = false;
</script>

<li class:disabled={to === undefined} class:menu-title={title}>
	{#if to !== undefined}
		<a
			class="overflow-hidden text-nowrap"
			href={to}
			class:active={fullMatch ? pathname === to : pathname.startsWith(to)}
		>
			{#if $$slots.icon}
				<slot name="icon"></slot>
			{:else}
				<svg height="28px" width="28px"></svg>
			{/if}
			<span class="inline-block text-nowrap py-0 transition-opacity" data-content>
				<slot />
			</span>
		</a>
	{:else}
		<span class="overflow-hidden text-nowrap">
			{#if $$slots.icon}
				<slot name="icon"></slot>
			{:else}
				<svg height="28px" width="28px"></svg>
			{/if}
			<span class="text-nowrap py-0 transition-opacity" data-content>
				<slot />
			</span>
		</span>
	{/if}
</li>
