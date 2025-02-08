import { browser } from '$app/environment'; // Check if we are running in the browser
import { get, writable, derived } from 'svelte/store';
import { persisted } from 'svelte-persisted-store';

import M19 from '$lib/assets/M19.json';
import N19 from '$lib/assets/N19.json';
import N20 from '$lib/assets/N20.json';
import M21 from '$lib/assets/M21.json';
import M22 from '$lib/assets/M22.json';
import N22 from '$lib/assets/N22.json';
import M23 from '$lib/assets/M23.json';
import N23 from '$lib/assets/N23.json';
import M24 from '$lib/assets/M24.json';

export const availableBoundaries = [
	M19,
	N19,
	N20,
	M21,
	M22,
	N22,
	M23,
	N23,
	M24
];

const CURRENT_VERSION = '1.0.0';

/**
 * Initialize a store with version checking and optional persistence.
 * If the version changes, the store is reset.
 */
function initializeVersionedStore(key, defaultValue) {
	// If not in a browser environment, fallback to a writable store
	if (!browser) {
		return writable(defaultValue);
	}

	// Version handling: Check if the stored version matches the current version
	const storedVersion = localStorage.getItem('app_version');
	if (!storedVersion || storedVersion !== CURRENT_VERSION) {
		// Reset only the specified key and update the version
		localStorage.removeItem(key);
		localStorage.setItem('app_version', CURRENT_VERSION);

        localStorage.setItem('selectedTimezone', '0');
        localStorage.setItem("predictorSelectedOptions", JSON.stringify({0:{},1:{},2:{},3:{},4:{},5:{},6:{}}));
	}

	// Return a persisted store if in the browser
	return persisted(key, defaultValue);
}

// Stores
export const appVersion = initializeVersionedStore('appVersion', CURRENT_VERSION);
export const selectedBoundaryId = initializeVersionedStore('selectedBoundaryId', 'N23'); // Change DEFAULT here
export const selectedBoundary = derived(selectedBoundaryId, ($selectedBoundaryId) =>
	availableBoundaries.find((boundary) => boundary.info.short === $selectedBoundaryId)
);

// 0 is TZ1, 1 is TZ2
export const selectedTimezone = initializeVersionedStore('selectedTimezone', 0);

const predictorSelectedOptions = initializeVersionedStore('predictorSelectedOptions', {
	0: {},
	1: {},
	2: {},
	3: {},
	4: {},
	5: {},
	6: {}
});

// Exported function for predictor-specific options
export function getPredictorSelectedOptions(group) {
	const { subscribe, update } = writable(get(predictorSelectedOptions)[group]);
	return {
		subscribe,
		set: function (value) {
			predictorSelectedOptions.update((current) => {
				current[group] = value;
				return current;
			});
			update((e) => e);
		}
	};
}
