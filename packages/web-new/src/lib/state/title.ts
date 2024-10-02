import { writable } from 'svelte/store';

const title = writable('犇站');
const setTitle = (pageTitle: string) => {
    title.update(() => `${pageTitle} - 犇站`)
}

export { title, title as default, setTitle };
