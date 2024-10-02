export const load = ({ url: requestUrl }) => {
	const url = new URL(requestUrl);
	const urlParams = url.searchParams;

	return {
		keyword: urlParams.get('keyword') ?? '',
		senderText: urlParams.getAll('senders').join(',') ?? '',
		dateBefore: urlParams.get('date_before') ?? undefined,
		dateAfter: urlParams.get('date_after') ?? undefined
	};
};
