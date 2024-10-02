<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';

	export let join: boolean = false;
	export let border: boolean = false;
	export let flow: boolean = false;
	export let responsive: boolean = false;

	onMount(() => {
		// @ts-ignore
		(window.adsbygoogle = window.adsbygoogle || []).push({});
	});
</script>

<div class="card card-compact {border && 'border'} {join && 'join-item'}">
	<div class="card-body ad">
		{#if flow}
			<ins
				class="adsbygoogle"
				data-ad-format="fluid"
				data-ad-layout-key="-gw-3+1f-3d+2z"
				data-ad-client="ca-pub-4905414776827944"
				data-ad-slot="5163409023"
			></ins>
		{:else}
			<ins
				class="adsbygoogle {responsive ? 'inline' : 'block'} w-full"
				data-ad-client="ca-pub-4905414776827944"
				data-ad-slot="3969315658"
				data-ad-format="auto"
				data-full-width-responsive={responsive ? 'true' : undefined}
			></ins>
		{/if}
	</div>
</div>

{#if dev}
	<style scoped>
		.ad {
			background: black;
		}
	</style>
{/if}
