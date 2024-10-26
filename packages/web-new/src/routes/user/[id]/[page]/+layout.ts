export const load = ({ params: { id, page }, url }) => {
	return { id, page, analytics: url.pathname.endsWith('/analytics') };
};

export const ssr = false;
