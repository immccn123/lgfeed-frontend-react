import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params: { username } }) => {
	return { username };
};
