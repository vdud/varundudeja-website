import { writable } from 'svelte/store';

// @dev: TODO, reown are fucking lazy and don't fully name type attributes, this could be a nice-to-have.
export const accountState = writable({});
export const networkState = writable({});
export const appKitState = writable({});
// @dev: Removed reown theme, code left here as example to re-enable if wanted.
// export const themeState = writable({ themeMode: 'dark', themeVariables: {} })
export const events = writable([]);
export const walletInfo = writable({});
