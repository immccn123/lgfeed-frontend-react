<script lang="ts">
	const runningDays = (
		(new Date().getTime() - new Date('2023/07/01 13:05').getTime()) /
		(1000 * 60 * 60 * 24)
	).toFixed();
</script>

<footer class="footer bg-base-200 text-base-content p-10">
	<aside>
		<p>
			犇站 ✨ Zephyr Version /
			<!-- svelte-ignore missing-declaration (declared in vite.config.ts) -->
			<code>{__VERSION__} ({__LASTMOD__})</code>
			<br />
			Copyright &copy;
			<a href="https://imken.moe" class="link-primary" target="_blank"> Imken Luo </a>
		</p>
		<div class="divider"></div>
		<p>
			本站已在随时准备跑路的状态下以极其不稳定的方式运行了 {runningDays} 天
		</p>
	</aside>
	<nav>
		<h6 class="footer-title">法律信息</h6>
		<a class="link link-hover" href="/legal/privacy">隐私协议</a>
		<a class="link link-hover" href="/legal/disclaimer">免责声明</a>
		<a class="link link-hover" href="/legal/censorship">数据移除请求</a>
	</nav>
</footer>
