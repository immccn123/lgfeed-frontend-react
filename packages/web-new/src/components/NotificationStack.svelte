<script lang="ts">
	import Notification from './Notification.svelte';
	import notifications from '$lib/state/notifications';

	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
</script>

<div class="alert-warning alert-success alert-error hidden">To prevent the css is tree-shaken.</div>

<div class="fixed right-1 bottom-1 z-10 min-w-56">
	<div class="grid gap-1">
		{#each Object.entries($notifications).sort() as [key, { role, msg }] (key)}
			<div
				animate:flip={{ duration: 300 }}
				in:fly={{ x: 100, duration: 300, delay: 0 }}
				out:fly={{ y: -100, duration: 300, delay: 0 }}
				class="z-10"
			>
				{#key key}
					<Notification {role}>{msg}</Notification>
				{/key}
			</div>
		{/each}
	</div>
</div>
