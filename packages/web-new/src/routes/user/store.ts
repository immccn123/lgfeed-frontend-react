import { writable } from "svelte/store";

export const isLoading = writable(false);
export const initialUid = writable<string | undefined>(undefined);
