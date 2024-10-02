<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import Benben from '../components/Benben.svelte';
	import MdiRefresh from '~icons/mdi/refresh';
	import { createFetcher, isProcessDied } from '$lib';
	import ProcStatusBadge from '../components/ProcStatusBadge.svelte';
	import { addNotification } from '$lib/state/notifications';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import MdiCubeScan from '~icons/mdi/cube-scan';
	import MdiHours24 from '~icons/mdi/hours-24';

	const stat = createQuery<API.Stat>({
		queryKey: ['/statistics'],
		queryFn: createFetcher(`/statistics`),
		refetchInterval: 10000
	});

	const randomBenben = createQuery<API.Benben>({
		queryKey: ['/tools/getRandom'],
		queryFn: createFetcher(`/tools/getRandom`),
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchOnWindowFocus: false
	});

	const procStat = createQuery<API.ProcStatus>({
		queryKey: ['/proc/status'],
		queryFn: createFetcher(`/proc/status`),
		refetchInterval: 5000
	});

	function restartProcess(proc: 'fetcher' | 'loop') {
		addNotification('success', '已经发出启动进程请求');
		fetch(`${PUBLIC_API_BASE}/proc/start?proc=${proc}`)
			.catch((e) => {
				addNotification('error', String(e));
			})
			.finally(() => {
				$procStat.refetch();
			});
	}
</script>

<div class="container m-5 mx-auto grid gap-4">
	<div>
		<h2 class="mb-2 text-xl">统计数据</h2>
		<div class="stats border">
			<div class="stat">
				<div class="stat-figure text-secondary"></div>
				<div class="stat-title">累计保存的犇犇</div>
				<div class="stat-figure text-primary"><MdiCubeScan /></div>
				<div class="stat-value text-primary">
					{#if $stat.isLoading}
						<span class="loading loading-ring loading-lg"></span>
					{:else if $stat.isSuccess}
						{$stat.data.total_count.toLocaleString()}
					{/if}
				</div>
				<div class="stat-desc">
					{new Date('2023/07/01 13:05').toLocaleDateString()} - {new Date().toLocaleDateString()}
				</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary"></div>
				<div class="stat-title">近 24 小时内共计保存</div>
				<div class="stat-figure text-secondary"><MdiHours24 /></div>
				<div class="stat-value text-secondary">
					{#if $stat.isLoading}
						<span class="loading loading-ring loading-lg"></span>
					{:else if $stat.isSuccess}
						{$stat.data.today_count.toLocaleString()}
					{/if}
				</div>
				<div class="stat-desc">截至 {new Date().toLocaleString()}</div>
			</div>
		</div>
	</div>

	<div>
		<h2 class="mb-2 text-xl">
			随机犇犇 <button
				class="btn btn-xs w-24"
				disabled={$randomBenben.isRefetching}
				on:click={() => $randomBenben.refetch()}
			>
				{#if $randomBenben.isRefetching}
					<span class="loading loading-ring loading-xs"></span>
				{:else if $randomBenben.isSuccess}
					<MdiRefresh /> 换一个！
				{/if}
			</button>
		</h2>
		{#if $randomBenben.isLoading}
			<div class="card card-compact border">
				<div class="card-body">
					<div class="flex">
						<div class="avatar mr-3 flex-none">
							<div class="skeleton h-10 shrink-0 rounded-full"></div>
						</div>
						<div class="grid flex-1 gap-1 leading-5">
							<div class="skeleton h-4 w-56"></div>
							<div class="skeleton h-4 w-56"></div>
						</div>
					</div>
					<div class="skeleton h-12 w-full"></div>
				</div>
			</div>
		{:else if $randomBenben.isSuccess}
			<Benben join {...$randomBenben.data} />
		{/if}
	</div>

	<div>
		<h2 class="mb-2 text-xl">爬虫状态</h2>
		<ul>
			<li>
				轮询抓取器：
				{#if $procStat.isLoading}
					<span class="loading loading-ring loading-sm"></span>
				{:else if $procStat.isSuccess}
					<ProcStatusBadge status={$procStat.data.fetcher_status} />
					{#if isProcessDied($procStat.data.fetcher_status)}
						<button class="btn btn-xs" on:click={() => restartProcess('fetcher')}>
							重新启动
						</button>
					{/if}
				{/if}
			</li>
			<li>
				循环抓取器：
				{#if $procStat.isLoading}
					<span class="loading loading-ring loading-sm"></span>
				{:else if $procStat.isSuccess}
					<ProcStatusBadge status={$procStat.data.loop_status} />
					{#if isProcessDied($procStat.data.loop_status)}
						<button class="btn btn-xs" on:click={() => restartProcess('loop')}>
							重新启动
						</button>
					{/if}
				{/if}
			</li>
		</ul>
	</div>
</div>
