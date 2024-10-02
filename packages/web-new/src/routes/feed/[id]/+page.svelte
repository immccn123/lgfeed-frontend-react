<script lang="ts">
	import { setTitle } from '$lib/state/title';
	import Benben from '../../../components/Benben.svelte';

	export let data;

	setTitle(`${data.benben.username} 的犇犇 #${data.benben.id}`);
</script>

<div class="container mx-auto">
	<Benben {...data.benben} />
</div>
