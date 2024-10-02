import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

import { exec } from 'child_process';
import { promisify } from 'util';

// Get current tag/commit and last commit date from git
const pexec = promisify(exec);
let [version, lastmod] = (
	await Promise.allSettled([
		pexec('git describe --tags || git rev-parse --short HEAD'),
		pexec('git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"')
	])
).map((x) => (x.status === 'fulfilled' ? x.value?.stdout.trim() : undefined));

export default defineConfig({
	plugins: [sveltekit(), Icons({ compiler: 'svelte' })],
	define: {
		__VERSION__: `"${version}"`,
		__LASTMOD__: `"${lastmod}"`
	}
});
