<script lang="ts">
	import MenuLink from './MenuLink.svelte';

	import MdiClose from '~icons/mdi/close';
	import MdiHome from '~icons/mdi/home';
	import MaterialAlternateEmail from '~icons/mdi/alternate-email';
	import MdiDotsCircle from '~icons/mdi/dots-circle';
	import MdiHistory from '~icons/mdi/history';
	import MdiSearch from '~icons/mdi/search';
	import MdiStars from '~icons/mdi/stars';
</script>

<ul
	class="
		menu menu-md bg-base-100 z-50 flex min-h-full
		max-lg:w-56
		lg:fixed lg:top-0 lg:shadow
		lg:transition-[all!important] lg:hover:w-56 lg:hover:shadow-xl
	"
>
	<label for="sidebar-toggle" class="btn drawer-button btn-square btn-ghost mb-1 lg:hidden">
		<MdiClose width="1.8em" height="1.8em" />
	</label>
	<MenuLink to="/" fullMatch>
		<MdiHome width="24px" height="24px" slot="icon" />
		首页
	</MenuLink>
	<MenuLink to="/tools/at">
		<MaterialAlternateEmail width="24px" height="24px" slot="icon" />
		被 at 查询
	</MenuLink>
	<MenuLink to="/tools/circle">
		<MdiDotsCircle width="24px" height="24px" slot="icon" />
		犇圈
	</MenuLink>
	<MenuLink to="/user">
		<MdiHistory width="24px" height="24px" slot="icon" />
		用户历史
	</MenuLink>
	<MenuLink to="/search">
		<MdiSearch width="24px" height="24px" slot="icon" />
		高级检索
	</MenuLink>
	<li class="invisible flex-grow"></li>
	<MenuLink>
		<MdiStars width="24px" height="24px" slot="icon" />
		犇站 Zephyr Ver.
	</MenuLink>
</ul>

<style scoped>
	:global(.menu:hover *[data-content]) {
		display: unset;
	}

	.menu {
		transition-timing-function: cubic-bezier(0.22, 0.685, 0.03, 0.895);
		transition-duration: 0.3s;
	}
</style>
