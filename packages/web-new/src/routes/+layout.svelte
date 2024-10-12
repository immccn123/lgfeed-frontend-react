<script lang="ts">
	import '../app.css';

	import MdiMenu from '~icons/mdi/menu';
	import NotificationStack from '../components/NotificationStack.svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import Footer from '../components/Footer.svelte';
	import Menu from '../components/Menu.svelte';

	import { ModeWatcher, systemPrefersMode } from 'mode-watcher';
	import HeadTitle from '../components/HeadTitle.svelte';
	import ShareDialog from '../components/ShareDialog.svelte';
	import MarkdownDialog from '../components/MarkdownDialog.svelte';

	systemPrefersMode.subscribe((value) => {
		if (value === 'light') document.body.setAttribute('data-theme', 'lemonade');
		else if (value === 'dark') document.body.setAttribute('data-theme', 'dim');
	});
</script>

<ModeWatcher />
<NotificationStack />
<HeadTitle />
<ShareDialog />
<MarkdownDialog />

<div class="h-screen">
	<QueryClientProvider>
		<div class="drawer lg:drawer-open">
			<input id="sidebar-toggle" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content bg-base-100 h-full">
				<div class="navbar bg-base-100 sticky top-0 z-10 border shadow lg:hidden">
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
					<main class="z-0 p-3">
						<slot></slot>
					</main>
					<div class="flex-grow"></div>
					<Footer />
				</div>
			</div>
			<div class="drawer-side z-20">
				<label for="sidebar-toggle" aria-label="close sidebar" class="drawer-overlay" />

				<Menu />
			</div>
		</div>
	</QueryClientProvider>
</div>

<style scoped>
	@media (min-width: 1024px) {
		.main-content {
			padding-left: calc(56px + 16px);
		}
	}
</style>
