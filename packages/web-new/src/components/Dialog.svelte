<script lang="ts">
	export function showModal() {
		dialog.showModal();
	}
	let dialog: HTMLDialogElement;
	export let title: string | undefined = undefined;
</script>

<dialog class="modal" bind:this={dialog}>
	<div class="modal-box">
		{#if $$slots.title}
			<slot name="title" />
		{:else if title !== undefined}
			<h3 class="text-lg font-bold">
				{title}
			</h3>
		{/if}
		<p class="py-4">
			<slot />
		</p>
		<div class="modal-action">
			<slot name="action" />
		</div>
	</div>
</dialog>
