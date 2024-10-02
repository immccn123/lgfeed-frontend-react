<script lang="ts">
	import { createFetcher } from '$lib';
	import { createQuery } from '@tanstack/svelte-query';
	import { initialUid, isLoading } from '../../store.js';
	import MdiCommentAlert from '~icons/mdi/comment-alert';
	import Benben from '../../../../components/Benben.svelte';
	import MdiPageFirst from '~icons/mdi/page-first';
	import MdiPageLast from '~icons/mdi/page-last';
	import Ad from '../../../../components/Ad.svelte';
	import { setTitle } from '$lib/state/title.js';

	export let data;

	$: uid = data.id;
	$: page = +data.page;

	$: $initialUid = uid;

	const perPage = 50;

	$: historyUsernames = createQuery<string[]>({
		queryKey: ['/blackHistory/usernames/', uid ?? ''],
		queryFn: createFetcher(`/blackHistory/usernames/${uid}`),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false
	});

	$: benbens = createQuery<API.UserBenbens>({
		queryKey: [`/blackHistory/feed/${uid}?page=${page}&per_page=${perPage}`],
		queryFn: createFetcher(`/blackHistory/feed/${uid}?page=${page}&per_page=${perPage}`),
		refetchOnMount: true,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false
	});

	$: $isLoading = $historyUsernames.isLoading || $benbens.isLoading;

	$: count = $benbens.data?.count;
	$: pageLimit = Math.ceil((count ?? 1) / perPage);
	$: pagesNavigation = (() => {
		if (page < 1) return [];
		if (page > pageLimit) return [1];

		let start = Math.max(1, page - 2);
		let end = Math.min(pageLimit, page + 2);

		if (end - start < 4) {
			if (start === 1) {
				end = Math.min(start + 4, pageLimit);
			} else if (end === pageLimit) {
				start = Math.max(end - 4, 1);
			}
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	})();

	$: setTitle(`${$historyUsernames.data?.join(' / ')?.concat('的') ?? ''}用户历史`);
</script>

<div class="grid gap-3">
	<h3 class="mt-3 text-lg">曾用名</h3>

	{#if $historyUsernames.isLoading}
		<span class="loading loading-ring loading-lg"></span>
	{:else if $historyUsernames.isSuccess}
		{#if $historyUsernames.data.length === 0}
			<div class="alert">
				<MdiCommentAlert /> 这里暂时没有 TA 的信息呢
			</div>
		{:else}
			<ul>
				{#each $historyUsernames.data as username (username)}
					<li><pre><code>{username}</code></pre></li>
				{/each}
			</ul>
		{/if}
	{/if}

	<h3 class="text-lg">历史犇犇</h3>
	{#if $benbens.isLoading}
		<span class="loading loading-ring loading-lg"></span>
	{:else if $benbens.isSuccess}
		{#if $benbens.data.count === 0}
			<div class="alert">
				<MdiCommentAlert /> 这里暂时没有 TA 的信息呢
			</div>
		{/if}
		<div class="join join-vertical w-full overflow-hidden break-words">
			{#each $benbens.data.feeds as benben, i (benben.id)}
				<Benben {...benben} join />
				{#if (i + 1) % 15 === 0}
					<Ad join flow />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<div class="card card-compact bg-base-100 w-120 sticky bottom-2 mt-2 shadow">
	<div class="card-body">
		<div class="join justify-center">
			<a class="join-item btn {$isLoading && 'btn-disabled'}" href="/user/{uid}/1">
				<MdiPageFirst />
			</a>
			{#each pagesNavigation as p}
				<a
					class="
						join-item btn {p === page && 'btn-active'}
						{$isLoading && 'btn-disabled'}"
					href="/user/{uid}/{p}"
				>
					{p}
				</a>
			{/each}
			<a class="join-item btn {$isLoading && 'btn-disabled'}" href="/user/{uid}/{pageLimit}">
				<MdiPageLast />
			</a>
		</div>
	</div>
</div>
