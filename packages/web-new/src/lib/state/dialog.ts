import { writable } from 'svelte/store';

export const shareDialogStore = writable<{ id: number | null; element: HTMLDivElement | null }>({
	id: null,
	element: null
});

export function showShareDialog(id: number, element: HTMLDivElement) {
    shareDialogStore.set({ id, element });
}

export const markdownDialogStore = writable<{ id: number | null; content: string | null }>({
	id: null,
	content: null
});

export function showMarkdownDialog(id: number, content: string) {
	markdownDialogStore.set({ id, content });
}
