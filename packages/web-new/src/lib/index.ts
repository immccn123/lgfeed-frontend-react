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

// https://stackoverflow.com/questions/12168909/blob-from-dataurl
export function dataURItoBlob(dataURI: string) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	const byteString = atob(dataURI.split(",")[1]);
  
	// separate out the mime component
	const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  
	// write the bytes of the string to an ArrayBuffer
	const ab = new ArrayBuffer(byteString.length);
  
	// create a view into the buffer
	const ia = new Uint8Array(ab);
  
	// set the bytes of the buffer to the correct values
	for (let i = 0; i < byteString.length; i++) {
	  ia[i] = byteString.charCodeAt(i);
	}
  
	// write the ArrayBuffer to a blob, and you're done
	const blob = new Blob([ab], { type: mimeString });
	return blob;
  }
  