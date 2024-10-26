<script lang="ts">
	import Ad from './Ad.svelte';

	const runningDays = (
		(new Date().getTime() - new Date('2023/07/01 13:05').getTime()) /
		(1000 * 60 * 60 * 24)
	).toFixed();
</script>

<Ad />

<footer class="footer bg-base-200 text-base-content p-10">
	<aside>
		<p>
			犇站 ✨ Zephyr Version<br />
			<!-- svelte-ignore missing-declaration (declared in vite.config.ts & app.d.ts) -->
			<code>{__VERSION__} ({__LASTMOD__})</code>
			<br />
			Copyright &copy;
			<a href="https://imken.moe" class="link link-hover" target="_blank"> Imken </a>
		</p>
		<p>
			本站已在随时准备跑路的状态下以极其不稳定的方式运行了 {runningDays} 天
		</p>
		<p>意见或问题反馈请加 QQ 群：313404608</p>
		<p>
			支持我们继续做下去！
			<a class="link link-error link-hover" href="https://sponsor.imken.moe/">捐赠（请备注为犇站）</a>
		</p>
	</aside>
	<nav>
		<h6 class="footer-title">法律信息</h6>
		<a class="link link-hover" href="/legal/privacy">隐私协议</a>
		<a class="link link-hover" href="/legal/disclaimer">免责声明</a>
		<a class="link link-hover" href="/legal/censorship">数据移除请求</a>
		<a
			class="link link-hover"
			target="_blank"
			href="https://github.com/immccn123/lgfeed-frontend-react"
		>
			前端源码仓库
		</a>
	</nav>
</footer>
