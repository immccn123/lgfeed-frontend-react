import { PUBLIC_API_BASE } from '$env/static/public';
import { AwesomeQR } from 'awesome-qr';

export function download(url: string, name: string) {
	const a = document.createElement('a');
	a.setAttribute('href', url);
	a.setAttribute('download', name);
	a.click();
}

export const generateQRCode = (text: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		new AwesomeQR({
			text: text,
			size: 120
		})
			.draw()
			.then((buf) => {
				if (typeof buf === 'string') resolve(buf);
				const blob = new Blob([buf as ArrayBuffer], { type: 'image/png' });
				reader.readAsDataURL(blob);
			});
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (e) => reject(e);
	});
};

export const copyText = (text: string) => {
	navigator.clipboard.writeText(text);
};

export const createFetcher = <T = unknown>(path: string) => async () =>
	await fetch(`${PUBLIC_API_BASE}${path}`).then((res) => res.json() as T);

export const isProcessDied = (status: API.ProcessState) => status === 'FATAL' || status === 'EXITED' || status === 'STOPPED' || status === 'BACKOFF'
