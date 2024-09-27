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
]

export const selectedBoundaryId = persisted('selectedBoundaryId', 'N23') // change DEFAULT here
export const selectedBoundary = derived(selectedBoundaryId, $selectedBoundaryId => availableBoundaries.find(boundary => boundary.info.short == $selectedBoundaryId))

// 0 is TZ1, 1 is TZ2
export const selectedTimezone = persisted('selectedTimezone', 0)

const predictorSelectedOptions = persisted('predictorSelectedOptions', { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} })
export function getPredictorSelectedOptions(group) {
    const { subscribe, set } = writable(get(predictorSelectedOptions)[group]);
    predictorSelectedOptions.subscribe(value => set(value[group]));
    return {
        subscribe,
        set: function (value) {
            predictorSelectedOptions.update(current => {
                current[group] = value;
                return current;
            });
        },
    }
}

// import { writable } from "svelte/store"
// import { browser } from "$app/environment"
// import data from '$lib/assets/courses.json';
// import M22 from '$lib/assets/M22.json';

// export const courses = writable(Object.keys(data).map((courseName) => ({
//     name: courseName,
//     description: data[courseName].description,
//     short: data[courseName].short,
//     assessmentModel: data[courseName].assessmentModel,
//     SL: data[courseName].SLAssessments,
//     HL: data[courseName].HLAssessments,
//     groupNumber: data[courseName].groupNumber,
//     info: data['info']
// })));

// export const gradeBoundaryData = writable();

// export const tok = writable(browser && localStorage && localStorage.getItem("tok") || '{"tok":[0, 0], "ee":[0]}')
// tok.subscribe((val) => {
//     if (browser && localStorage) localStorage.setItem("tok", val)
// });

// export const selectedGroup6 = writable(browser && localStorage && localStorage.getItem("selectedGroup6") || "6")
// selectedGroup6.subscribe((val) => {
//     if (browser && localStorage) localStorage.setItem("selectedGroup6", val)
// });

// // change default here
// export const gradeBoundary = writable(browser && localStorage && localStorage.getItem("gradeBoundary") || "N23")
// gradeBoundary.subscribe((val) => {
//     if (browser && localStorage) localStorage.setItem("gradeBoundary", val)
// });

// export const timezone = writable(browser && localStorage && localStorage.getItem("timezone") || "1")
// timezone.subscribe((val) => {
//     if (browser && localStorage) localStorage.setItem("timezone", val)
// });

// export const group1 = writable(browser && localStorage && localStorage.getItem("group1") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
// group1.subscribe((val) => {
//     if (browser && localStorage) JSON.stringify(localStorage.setItem("group1", val));
// });


// export const group2 = writable(browser && localStorage && localStorage.getItem("group2") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
// group2.subscribe((val) => {
//     if (browser && localStorage) JSON.stringify(localStorage.setItem("group2", val));
// });

// export const group3 = writable(browser && localStorage && localStorage.getItem("group3") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
// group3.subscribe((val) => {
//     if (browser && localStorage) JSON.stringify(localStorage.setItem("group3", val));
// });

// export const group4 = writable(browser && localStorage && localStorage.getItem("group4") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
// group4.subscribe((val) => {
//     if (browser && localStorage) JSON.stringify(localStorage.setItem("group4", val));
// });

// export const group5 = writable(browser && localStorage && localStorage.getItem("group5") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
// group5.subscribe((val) => {
//     if (browser && localStorage) JSON.stringify(localStorage.setItem("group5", val));
// });

// export const group6 = writable(browser && localStorage && localStorage.getItem("group6") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
// group6.subscribe((val) => {
//     if (browser && localStorage) JSON.stringify(localStorage.setItem("group6", val));
// });