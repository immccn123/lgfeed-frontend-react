<script lang="ts">
	import { createHistoryUsernameQuery } from '$lib/query/index.js';
	import { setTitle } from '$lib/state/title';
	import { initialUid } from '../../store.js';

	export let data;

	$: $initialUid = data.id;
	$: historyUsernames = createHistoryUsernameQuery(+data.id);
	$: setTitle(
		`${$historyUsernames.data?.join(' / ')?.concat(' 的') ?? ''}用户${data.analytics ? '分析' : '历史'}`
	);
</script>

<div role="tablist" class="tabs tabs-boxed mt-3" data-theme="light">
	<a role="tab" class="tab" href="/user/{data.id}/{data.page}" class:tab-active={!data.analytics}>
		动态
	</a>
	<a
		role="tab"
		class="tab"
		href="/user/{data.id}/{data.page}/analytics"
		class:tab-active={data.analytics}
	>
		分析
	</a>
</div>

<slot></slot>
