<script lang="ts">
	import { page } from '$app/stores';
	import { JsonView } from '@zerodevx/svelte-json-view';
</script>

<div class="prose p-4">
	<h1>出错啦 - {$page.status} {$page.error?.message}</h1>
	<details>
		<summary>详细信息</summary>
		<pre><code><JsonView json={$page} /></code></pre>
	</details>
	<p>可以刷新或者看看左侧菜单里有什么有意思的东西！</p>
</div>
