<script lang="ts">
	import MdiCodeTags from '~icons/mdi/code-tags';
	import MdiContentCopy from '~icons/mdi/content-copy';
	import MdiClose from '~icons/mdi/close';
	import Dialog from './Dialog.svelte';
	import { markdownDialogStore } from '$lib/state/dialog';
	import { copyText } from '$lib';
	import { addNotification } from '$lib/state/notifications';

	let markdownSrcDialog: Dialog | null = null;
	markdownDialogStore.subscribe(() => {
		markdownSrcDialog?.showModal();
	});
</script>

<Dialog bind:this={markdownSrcDialog}>
	<h3 class="text-lg font-bold" slot="title">
		<span><MdiCodeTags class="inline" /> Markdown 源码 (#{$markdownDialogStore.id})</span>
	</h3>

	<div class="w-full overflow-x-scroll">
		<pre class="w-full h-48"><code>{$markdownDialogStore.content}</code></pre>
	</div>
	<form slot="action" method="dialog" class="join">
		<button
			class="btn join-item"
			on:click={() => {
				if ($markdownDialogStore.content) {
					copyText($markdownDialogStore.content);
					addNotification('success', '复制成功！');
				}
			}}
		>
			<MdiContentCopy /> 复制
		</button>
		<button type="submit" class="btn btn-error join-item">
			<MdiClose /> 关闭
		</button>
	</form>
</Dialog>
