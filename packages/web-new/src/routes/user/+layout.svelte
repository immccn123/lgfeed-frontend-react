<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initialUid, isLoading } from './store';

	$: uid = $initialUid ?? '';

	onMount(() => {
		return () => ($initialUid = uid);
	});
</script>

<div class="container mx-auto">
	<h2 class="mb-3 text-2xl">用户历史</h2>

	<form on:submit|preventDefault={() => goto(`/user/${uid}/1`)}>
		<div class="join">
			<input
				type="number"
				placeholder="UID"
				class="input join-item input-bordered w-full max-w-xs"
				disabled={$isLoading}
				bind:value={uid}
			/>
			<button
				class="btn join-item"
				disabled={$isLoading || uid === '' || uid === null}
				type="submit"
			>
				Go!
			</button>
		</div>
	</form>

	<slot></slot>
</div>
