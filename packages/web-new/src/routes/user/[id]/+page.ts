import { redirect } from '@sveltejs/kit';

export const load = ({ params: { id } }) => {
	redirect(301, `/user/${id}/1`);
};
