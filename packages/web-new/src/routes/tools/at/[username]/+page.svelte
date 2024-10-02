<script lang="ts">
	import { createFetcher } from '$lib';
	import { createQuery } from '@tanstack/svelte-query';
	import { initialUsername, isLoading } from '../store.js';
	import MdiCommentAlert from '~icons/mdi/comment-alert';
	import Benben from '../../../../components/Benben.svelte';
	import Loader from '../../../../components/Loader.svelte';

	export let data;

	$: username = data.username;

	$: $initialUsername = username;

	$: benbens = createQuery<API.Benben[]>({
		queryKey: [`/tools/at/`, username],
		queryFn: createFetcher(`/tools/at/${encodeURIComponent(username)}`),
		refetchOnMount: true,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false
	});

	$: $isLoading = $benbens.isLoading;
</script>

<div class="grid gap-3 mt-3">
	{#if $benbens.isLoading}
		<Loader />
	{:else if $benbens.isSuccess}
		{#if $benbens.data.length === 0}
			<div class="alert">
				<MdiCommentAlert /> 看起来没有人在 at 呢
			</div>
		{/if}
		<div class="join join-vertical w-full overflow-hidden break-words">
			{#each $benbens.data as benben}
				<Benben {...benben} join />
			{/each}
		</div>
	{/if}
</div>
