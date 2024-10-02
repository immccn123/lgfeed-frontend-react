import { writable } from "svelte/store";

export const isLoading = writable(false);
export const initialUsername = writable<string | undefined>(undefined);
