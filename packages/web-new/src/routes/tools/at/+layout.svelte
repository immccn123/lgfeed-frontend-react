<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { initialUsername, isLoading } from './store';

	$: username = $initialUsername ?? '';

	onMount(() => () => ($initialUsername = username));
</script>

<div class="container mx-auto">
	<h2 class="mb-3 text-2xl">被 at 查询</h2>

	<form on:submit|preventDefault={() => goto(`/tools/at/${encodeURIComponent(username)}`)}>
		<div class="join">
			<input
				type="text"
				placeholder="用户名"
				class="input join-item input-bordered w-full max-w-xs"
				disabled={$isLoading}
				bind:value={username}
			/>
			<button
				class="btn join-item"
				disabled={$isLoading || username === '' || username === null}
				type="submit"
			>
				Go!
			</button>
		</div>
	</form>

	<slot></slot>
</div>
