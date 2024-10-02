import { writable } from 'svelte/store';

interface Notification {
	role: string;
	msg: string;
}

export const notifications = writable({} as Record<number, Notification>);
export default notifications;
export const id = writable(0);

export const addNotification = (role: string, msg: string, timeout: number = 3000) => {
	let newId: number;
	id.update((n) => (newId = n + 1));
	notifications.update((notification) => {
		notification[newId] = { role, msg };
		return notification;
	});
	setTimeout(() => {
		notifications.update((notification) => {
			delete notification[newId];
			return notification;
		});
	}, timeout);
};
