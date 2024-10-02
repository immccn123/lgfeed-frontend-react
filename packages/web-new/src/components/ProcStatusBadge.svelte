<script lang="ts">
	import { isProcessDied } from "$lib";

	export let status: API.ProcessState;
	export let join = false;
</script>

{#if status === 'RUNNING'}
	<div class="badge badge-success {join && 'join-item'}">{status}</div>
{:else if isProcessDied(status)}
	<div class="badge badge-error {join && 'join-item'}">{status}</div>
{:else}
	<div class="badge badge-warning {join && 'join-item'}">{status}</div>
{/if}
