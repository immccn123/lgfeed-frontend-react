import { createFetcher } from "$lib";
import { createQuery } from "@tanstack/svelte-query";

export const createHistoryUsernameQuery = (uid: number) => createQuery<string[]>({
    queryKey: ['/blackHistory/usernames/', uid ?? ''],
    queryFn: createFetcher(`/blackHistory/usernames/${uid}`),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false
});