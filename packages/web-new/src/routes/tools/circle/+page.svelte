<script lang="ts">
	import { PUBLIC_API_BASE } from '$env/static/public';
	import { addNotification } from '$lib/state/notifications';
	import cytoscape from 'cytoscape';
	import { writable } from 'svelte/store';
	import Ad from '../../../components/Ad.svelte';
	import Loader from '../../../components/Loader.svelte';

	const isLoading = writable(false);

	let uid = '';
	let uidInput = '';
	let response: API.BenbenCircleResponse | undefined;
	let container: HTMLDivElement;
	let showContainer = false;

	function intersect(r: number, rn: number, n: number) {
		let qn = Math.pow(2, rn + 2);
		let deg = (2 * Math.PI) / qn;
		let xi = Math.cos(n * deg) * r,
			yi = Math.sin(n * deg) * r,
			xi1 = Math.cos((n + 1) * deg) * r,
			yi1 = Math.sin((n + 1) * deg) * r;
		let x = (xi + xi1) / 2,
			y = (yi + yi1) / 2,
			rr = Math.sqrt(Math.pow(xi - xi1, 2) + Math.pow(yi - yi1, 2));
		return { x, y, rr: rr * 0.85 };
	}

	const rn = [20, 33, 43, 50, 55];

	const offsetX = 100,
		offsetY = 250;

	function getPos(index: number) {
		function transform({ x, y, rr }: { [p: string]: number }) {
			return { x: x * 100 + offsetX, y: y * 100 + offsetY, rr: rr * 100 };
		}
		// rn = 1 时 n = 0..8
		// rn = 2 时 n = 0..16 累计 8..24
		// rn = 3 时 n = 0..32 累计 24..56
		// rn = 4 时 n = 0..64 累计 56..56+64
		if (0 <= index && index < 8) {
			return transform(intersect(rn[0], 1, index));
		} else if (8 <= index && index < 24) {
			return transform(intersect(rn[1], 2, index - 8));
		} else if (24 <= index && index < 56) {
			return transform(intersect(rn[2], 3, index - 24));
		} else if (56 <= index && index < 56 + 64) {
			return transform(intersect(rn[3], 4, index - 56));
		} else {
			return transform(intersect(rn[4], 5, index - (56 + 64)));
		}
	}

	$: cy =
		response &&
		cytoscape({
			container,
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(label)',
						'background-fit': 'cover'
					}
				},
				{
					selector: `node[id="${uid}"]`,
					style: {
						'background-image': `url(${`https://cdn.luogu.com.cn/upload/usericon/${uid}.png`})`,
						height: 1600,
						width: 1600,
						'border-width': 50,
						'border-color': 'pink'
					}
				},
				...response.result.map((x, i) => ({
					selector: `node[id="${x.uid}"]`,
					style: {
						'background-image': `url(https://cdn.luogu.com.cn/upload/usericon/${x.uid}.png)`,
						height: getPos(i).rr,
						width: getPos(i).rr
					}
				}))
			],
			elements: [
				{
					group: 'nodes',
					data: {
						id: uid?.toString(),
						label: uid?.toString()
					},
					renderedPosition: { x: offsetX, y: offsetY }
				},
				...response.result.map((x, i) => ({
					group: 'nodes' as const,
					data: {
						id: x.uid.toString(),
						label: x.uid.toString(),
						weight: x.weight
					},
					position: getPos(i)
				}))
			],
			layout: { name: 'preset' },
			autolock: true,
			userZoomingEnabled: false,
			userPanningEnabled: false
		});

	function fetchData() {
		$isLoading = true;
		showContainer = false;
		cy?.destroy();
		response = undefined;
		uid = uidInput;
		fetch(`${PUBLIC_API_BASE}/tools/circle/${uid}`)
			.then((res) => {
				if (res.status !== 200) {
					throw '生成超时。但其实服务器后台也应该在生成，所以';
				}
				showContainer = true;
				return res.json() as Promise<API.BenbenCircleResponse>;
			})
			.then((res) => (response = res))
			.catch((e) => {
				addNotification('error', `出了些问题：${String(e)}，请 3 分钟后再试！`);
			})
			.finally(() => {
				$isLoading = false;
			});
	}
</script>

<div class="container mx-auto">
	<h2 class="mb-3 text-2xl">犇圈 / Benben Circle</h2>

	<form on:submit|preventDefault={() => fetchData()} class="mb-3">
		<div class="join">
			<input
				type="number"
				placeholder="UID"
				class="input join-item input-bordered w-full max-w-xs"
				disabled={$isLoading}
				bind:value={uidInput}
			/>
			<button
				class="btn join-item"
				disabled={$isLoading || uidInput === '' || uidInput === null}
				type="submit"
			>
				Go!
			</button>
		</div>
	</form>

	{#if $isLoading}
		<Loader>
			少女祈祷中<br />此过程根据用户热度和缓存情况，时长在 10s ~ 120s 不等。<br />
			如果这段时间实在是因为超时导致获取数据失败，为了缓解服务器压力，请等待三分钟之后再重试，因为这个时候缓存应该已经建立。
			<br />
			<Ad />
		</Loader>
	{/if}
	{#if response?.cacheHit}
		<span>这是缓存的结果。</span>
	{/if}
	<div bind:this={container} class={showContainer ? 'h-dvh border' : ''}></div>
</div>
