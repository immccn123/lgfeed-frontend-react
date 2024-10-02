<script lang="ts">
	import '../app.css';
	import Announcement from '../components/Announcement.svelte';

	import MdiMenu from '~icons/mdi/menu';
	import NotificationStack from '../components/NotificationStack.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import Footer from '../components/Footer.svelte';
	import Menu from '../components/Menu.svelte';

	let checkbox: HTMLInputElement;
</script>

<NotificationStack />

<div class="h-screen">
	<QueryClientProvider>
		<div class="drawer lg:drawer-open">
			<input id="sidebar-toggle" type="checkbox" class="drawer-toggle" bind:this={checkbox} />
			<div class="drawer-content h-full">
				<div class="navbar bg-base-100 z-50 border shadow lg:hidden">
					<div class="flex-none">
						<label for="sidebar-toggle" class="btn drawer-button btn-square btn-ghost">
							<MdiMenu width="1.8em" height="1.8em" />
						</label>
					</div>

					<div class="flex-1">
						<a class="btn btn-ghost text-xl" href="/"> 犇站 </a>
					</div>
				</div>
				<div class="main-content flex h-full flex-col">
					<main>
						<div class="p-3">
							<Announcement />
							<slot></slot>
						</div>
					</main>
					<div class="flex-grow"></div>
					<Footer />
				</div>
			</div>
			<div class="drawer-side">
				<label for="sidebar-toggle" aria-label="close sidebar" class="drawer-overlay"
				></label>

				<Menu />
			</div>
		</div>
	</QueryClientProvider>
</div>

<style scoped>
	:global(.menu:hover *[data-content]) {
		display: unset;
	}

	@media (min-width: 1024px) {
		.main-content {
			padding-left: calc(56px + 16px);
		}
	}
</style>
