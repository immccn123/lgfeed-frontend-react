<script lang="ts">
	import { setTitle } from '$lib/state/title';
	import Benben from '../../../components/Benben.svelte';
	import Takedown from '../../../components/Takedown.svelte';

	export let data;

	if ('takedown' in data.benben) {
		setTitle(`被撤下的犇犇`);
	} else {
		setTitle(`${data.benben.username} 的犇犇 #${data.benben.id}`);
	}
</script>

<div class="container mx-auto">
	{#if 'takedown' in data.benben}
		<Takedown takedown={data.benben.takedown_info} benbenId={data.benbenId} />
	{:else}
		<Benben {...data.benben} />
	{/if}
</div>
