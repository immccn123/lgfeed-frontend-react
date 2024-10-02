<script lang="ts">
	import { createFetcher } from '$lib';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import SveltyPicker from 'svelty-picker';
	import Benben from '../../components/Benben.svelte';
	import { goto } from '$app/navigation';
	import MdiCommentAlert from '~icons/mdi/comment-alert';
	import MdiSearch from '~icons/mdi/search';
	import MdiMoreHoriz from '~icons/mdi/more-horiz';
	import Ad from '../../components/Ad.svelte';

	export let data;
	let keyword = data.keyword ?? '';
	let senderText = data.senderText ?? '';
	let dateBefore = data.dateBefore;
	let dateAfter = data.dateAfter;
	let results: API.Benben[] = [];

	const params = (search: boolean = false, loadMore = false) => {
		const queryParams = [];
		if (keyword) queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
		if (senderText) {
			const senders = senderText.split(',').map((x) => parseInt(x.trim()));
			senders.forEach((value) => queryParams.push(`senders=${value}`));
		}
		if (dateBefore)
			queryParams.push(
				`date_before=${!search ? new Date(dateBefore).getTime() * 1000 : dateBefore}`
			);
		if (dateAfter)
			queryParams.push(
				`date_after=${!search ? new Date(dateAfter).getTime() * 1000 : dateAfter}`
			);
		if (!search && loadMore && results.length)
			queryParams.push(`id_after=${results.slice(-1)[0].id}`);
		return queryParams.join('&');
	};

	const query = createInfiniteQuery<API.Benben[]>({
		queryKey: ['searchResults', keyword, dateBefore, senderText, dateAfter],
		queryFn: async ({ pageParam }) =>
			createFetcher<API.Benben[]>(`/search/db?${params(false, pageParam as boolean)}`)(),
		getNextPageParam: (lastPage) => (lastPage.length === 50 ? true : undefined),
		initialPageParam: false,
		refetchInterval: 0,
		refetchOnMount: false,
		refetchIntervalInBackground: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false
	});

	$: queryData = $query.data?.pages.flat();
	$: isFetching = $query.isFetching;
	$: isLoading = $query.isLoading || $query.isRefetching;
	$: results = queryData ?? [];

	const loadMore = async () => {
		$query.fetchNextPage();
	};

	const searchHandler = () => {
		goto(`/search?${params(true)}`);
		queryData = [];
		$query.refetch();
	};
</script>

<div class="container mx-auto">
	<h2 class="text-2xl mb-2">犇犇检索</h2>

	<div class="w-full my-2">
		<form
			class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
			on:submit|preventDefault={searchHandler}
		>
			<div>
				<div class="label">
					<span class="label-text">子串</span>
				</div>
				<input
					type="text"
					bind:value={keyword}
					placeholder="不区分大小写"
					class="input input-bordered w-full"
				/>
			</div>

			<div>
				<div class="label">
					<span class="label-text">发送人 UID</span>
				</div>
				<input
					type="text"
					bind:value={senderText}
					placeholder="半角逗号分隔，例如 1,114514,3698"
					class="input input-bordered w-full"
				/>
			</div>

			<div>
				<div class="label">
					<span class="label-text">起始时间</span>
				</div>
				<SveltyPicker
					bind:value={dateAfter}
					inputClasses="input input-bordered w-full"
					displayFormat="yyyy-mm-dd hh:ii"
					format="yyyy-mm-dd hh:ii"
					mode="datetime"
					placeholder="留空不作约束"
				/>
			</div>

			<div>
				<div class="label">
					<span class="label-text">终止时间</span>
				</div>
				<SveltyPicker
					bind:value={dateBefore}
					inputClasses="input input-bordered w-full"
					displayFormat="yyyy-mm-dd hh:ii"
					format="yyyy-mm-dd hh:ii"
					mode="datetime"
					placeholder="留空不作约束"
				/>
			</div>
		</form>

		<button class="btn btn-sm mt-2 w-full" on:click={searchHandler} disabled={isFetching || isLoading}>
			<MdiSearch /> 搜索
		</button>
	</div>

	<div>
		{#if isLoading}
			<div class="text-center">
				<span class="loading loading-ring loading-lg"></span>
				<br />
				少女祈祷中
			</div>
		{:else if results.length !== 0}
			<div class="join join-vertical w-full">
				{#each results as result, i (result.id)}
					<Benben join {...result} />
					{#if (i + 1) % 15 === 0}
						<Ad join flow />
					{/if}
				{/each}
			</div>
		{/if}
	</div>
	{#if !isLoading}
		{#if $query.hasNextPage}
			<button class="btn btn-sm my-2 w-full" on:click={loadMore} disabled={isFetching}>
				{#if isFetching}
					<span class="loading loading-ring loading-sm"></span>
					少女祈祷中……
				{:else}
					<MdiMoreHoriz /> 加载更多
				{/if}
			</button>
		{:else}
			<div class="alert my-2 w-full">
				<MdiCommentAlert /> 似乎没有更多信息了 {'w(ﾟДﾟ)w'}
			</div>
		{/if}
	{/if}
</div>
