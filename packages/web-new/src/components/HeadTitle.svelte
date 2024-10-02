<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import title from '$lib/state/title';

	onNavigate(() => {
		$title = '犇站';
	});
</script>

<svelte:head>
	<title>{$title}</title>
</svelte:head>
