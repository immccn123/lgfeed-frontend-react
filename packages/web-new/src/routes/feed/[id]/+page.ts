import { PUBLIC_API_BASE } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params: { id: benbenId } }) => {
	const benben = await fetch(`${PUBLIC_API_BASE}/tools/getFeed/${benbenId}`).then(
		async (res) => (await res.json()) as API.Benben
	);

	return { benben };
};

export const ssr = false;
