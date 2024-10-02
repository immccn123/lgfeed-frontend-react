<script lang="ts">
	import MdiLinkVariant from '~icons/mdi/link-variant';
	import MdiClose from '~icons/mdi/close';
	import MdiMonitorScreenshot from '~icons/mdi/monitor-screenshot';
	import MdiDownload from '~icons/mdi/download';
	import MdiShareVariant from '~icons/mdi/share-variant';

	import Dialog from './Dialog.svelte';
	import Loader from './Loader.svelte';

	import { copyText, dataURItoBlob, download, generateQRCode } from '$lib';
	import { addNotification } from '$lib/state/notifications';

	import { shareDialogStore } from '$lib/state/dialog';

	import { onMount } from 'svelte';
	import html2canvas from 'html2canvas-pro';
	

	let origin = 'https://benben.sbs';
	let shareDialog: Dialog | null = null;

	onMount(() => {
		origin = location.origin;
	});

	shareDialogStore.subscribe(() => {
		shareDialog?.showModal();
	});

	async function takeScreenshot(operation: 'copy' | 'download') {
		$shareDialogStore.element!.classList.add('w-[32rem]');
		await html2canvas($shareDialogStore.element!, {
			allowTaint: true,
			useCORS: true,
			imageTimeout: 1000
		})
			.then((x) => x.toDataURL())
			.then((data) => {
				$shareDialogStore.element!.classList.remove('w-[32rem]');
				if (operation === 'download') {
					download(data, `${$shareDialogStore.id}.png`);
				} else {
					navigator.clipboard
						.write([new ClipboardItem({ 'image/png': dataURItoBlob(data) })])
						.catch((e) => addNotification('error', `无法复制截图：${String(e)}`))
						.then(() => addNotification('success', '截图已复制'));
				}
			});
	}
</script>

<Dialog bind:this={shareDialog} title="分享">
	<h3 class="text-lg font-bold" slot="title">
		<span><MdiShareVariant class="inline" /> 分享</span>
	</h3>
	<div class="grid gap-3">
		{#await generateQRCode(new URL(`/feed/${$shareDialogStore.id}`, origin).toString())}
			<Loader />
		{:then src}
			<img {src} alt="QR Code" />
		{/await}
	</div>
	<form class="join" slot="action" method="dialog">
		<button
			class="btn join-item"
			on:click={() => {
				if ($shareDialogStore.id) {
					copyText(new URL(`/feed/${$shareDialogStore.id}`, origin).toString());
					addNotification('success', '复制成功！');
				}
			}}
		>
			<MdiLinkVariant /> 复制链接
		</button>
		<button class="btn join-item" on:click={() => takeScreenshot('copy')}>
			<MdiMonitorScreenshot /> 复制截图
		</button>
		<button class="btn join-item" on:click={() => takeScreenshot('download')}>
			<MdiDownload /> 下载截图
		</button>
		<button class="btn btn-error join-item">
			<MdiClose /> 关闭
		</button>
	</form>
</Dialog>
