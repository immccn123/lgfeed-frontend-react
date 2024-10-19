<script lang="ts">
	import MdiRemove from '~icons/mdi/remove';
	import MarkdownIt from 'markdown-it';
	import { onMount } from 'svelte';

	export let takedown: API.TakedownInfo;
	export let join = false;
	export let benbenId;
	let origin = 'https://benben.sbs';

	onMount(() => {
		origin = location.origin;
	});
</script>

<div class="card card-compact text-wrap break-words border {join && 'join-item'}">
	<div class="card-body">
		<article class="prose">
			<p>{@html new MarkdownIt().render(takedown.reason)}</p>
		</article>
		<p>
			由 UID 为 {takedown.takedown_user_id} (
			<a class="link link-primary" href="/user/{takedown.takedown_user_id}"> 犇站链接 </a> |
			<a class="link link-primary" href="https://lglg.top/user/{takedown.takedown_user_id}">
				帖子保存站链接
			</a>
			|
			<a
				class="link link-primary"
				href="https://www.luogu.com/user/{takedown.takedown_user_id}"
			>
				洛谷链接
			</a>
			) 的用户于 {new Date(takedown.takedown_time + '+08:00').toLocaleString()} 申请撤下。
			<br />
			如有疑问，请参阅页脚的「数据移除请求」链接。
		</p>

		<div class="card-actions text-secondary-content text-xs">
			<a class="link-primary" href="/feed/{benbenId}">
				#{benbenId}x{takedown.batch_id}
			</a>
			<span class="flex-grow"></span>
		</div>
	</div>
</div>
