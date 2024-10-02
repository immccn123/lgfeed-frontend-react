<script lang="ts">
	import MarkdownIt from 'markdown-it';
	import MdiLinkVariant from '~icons/mdi/link-variant';
	import MdiReply from '~icons/mdi/reply';
	import MdiShareVariant from '~icons/mdi/share-variant';
	import MdiCodeTags from '~icons/mdi/code-tags';
	import { copyText } from '$lib';
	import { addNotification } from '$lib/state/notifications';

	export let id: number, username: string, time: string, content: string, grabTime: string;
	export let userId: number,
		join: boolean = false;

	let contentElement: HTMLDivElement;
</script>

<div class="card card-compact text-wrap break-words border {join && 'join-item'}">
	<div class="card-body">
		<div class="flex">
			<div class="avatar mr-3 flex-none">
				<div class="h-10 w-10 rounded-full">
					{#await fetch(`https://cdn.luogu.com.cn/upload/usericon/${userId}.png`)}
						<span class="loading loading-ring loading-lg"></span>
					{:then}
						<img
							alt="{username} 的头像"
							class="not-prose"
							src="https://cdn.luogu.com.cn/upload/usericon/{userId}.png"
						/>
					{/await}
				</div>
			</div>
			<div class="flex-1 leading-5">
				<a href="/user/{userId}" class="link-primary text-sm">
					{username}
				</a>
				<br /><span class="text-xs" style="color: 0xcccccc;">
					发送于 {new Date(time).toLocaleString()}，保存于
					{new Date(grabTime).toLocaleString()}
				</span>
			</div>
		</div>

		<div class="prose max-w-full text-sm" bind:this={contentElement}>
			{@html new MarkdownIt().render(content)}
		</div>

		<div class="card-actions text-secondary-content text-xs">
			<a class="link-primary" href="/feed/{id}">#{id}</a>
			<a class="link-primary" href="/feed/{id}">
				<MdiLinkVariant class="inline" /> 永久链接
			</a>
			<button
				class="link-primary"
				on:click={() => {
					copyText(` || @${username} : ${contentElement.innerText}`);
					addNotification('success', '回复文本已复制！');
				}}
			>
				<MdiReply class="inline" /> 回复
			</button>
			<span class="link-primary">
				<MdiShareVariant class="inline" /> 分享
			</span>
			<span class="link-primary">
				<MdiCodeTags class="inline" /> 查看 Markdown 源码
			</span>
			<span class="flex-grow"></span>
		</div>
	</div>
</div>

<style scoped>
	:global(.prose a) {
		color: cadetblue;
	}

	:global(.prose img) {
		max-width: 100%;
		max-height: 500px;
	}
</style>
