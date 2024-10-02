<script lang="ts">
	import Benben from '../../../components/Benben.svelte';

	export let data;
</script>

<div class="container mx-auto">
	<Benben {...data.benben} />
</div>
