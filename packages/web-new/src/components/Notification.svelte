<script lang="ts">
	export let role: string
</script>

<div role="alert" class="alert alert-{role} ">
	<slot></slot>
</div>
