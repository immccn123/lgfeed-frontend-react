<script lang="ts">
	export let size: 'sm' | 'lg' | 'xl' | 'normal' = 'lg';
</script>

<div class="text-center">
	{#if size === 'sm'}
		<span class="loading loading-ring loading-sm"></span>
	{:else if size === 'lg'}
		<span class="loading loading-ring loading-lg"></span>
	{:else if size === 'xl'}
		<span class="loading loading-ring loading-xl"></span>
	{:else}
		<span class="loading loading-ring"></span>
	{/if}

	<br />
	{#if $$slots.default}
		<slot></slot>
	{:else}
		少女祈祷中
	{/if}
</div>
