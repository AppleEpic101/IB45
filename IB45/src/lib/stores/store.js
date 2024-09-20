import { writable } from "svelte/store"
import { browser } from "$app/environment"
import data from '$lib/assets/courses.json';
import M22 from '$lib/assets/M22.json';

export const courses = writable(Object.keys(data).map((courseName) => ({
    name: courseName,
    description: data[courseName].description,
    short: data[courseName].short,
    assessmentModel: data[courseName].assessmentModel,
    SL: data[courseName].SLAssessments,
    HL: data[courseName].HLAssessments,
    groupNumber: data[courseName].groupNumber,
    info: data['info']
})));

export const gradeBoundaryData = writable();

export const tok = writable(browser && localStorage && localStorage.getItem("tok") || '{"tok":[0, 0], "ee":[0]}')
tok.subscribe((val) => {
    if (browser && localStorage) localStorage.setItem("tok", val)
});

export const selectedGroup6 = writable(browser && localStorage && localStorage.getItem("selectedGroup6") || "6")
selectedGroup6.subscribe((val) => {
    if (browser && localStorage) localStorage.setItem("selectedGroup6", val)
});

// change default here
export const gradeBoundary = writable(browser && localStorage && localStorage.getItem("gradeBoundary") || "M23")
gradeBoundary.subscribe((val) => {
    if (browser && localStorage) localStorage.setItem("gradeBoundary", val)
});

export const timezone = writable(browser && localStorage && localStorage.getItem("timezone") || "1")
timezone.subscribe((val) => {
    if (browser && localStorage) localStorage.setItem("timezone", val)
});

export const group1 = writable(browser && localStorage && localStorage.getItem("group1") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
group1.subscribe((val) => {
    if (browser && localStorage) JSON.stringify(localStorage.setItem("group1", val));
});


export const group2 = writable(browser && localStorage && localStorage.getItem("group2") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
group2.subscribe((val) => {
    if (browser && localStorage) JSON.stringify(localStorage.setItem("group2", val));
});

export const group3 = writable(browser && localStorage && localStorage.getItem("group3") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
group3.subscribe((val) => {
    if (browser && localStorage) JSON.stringify(localStorage.setItem("group3", val));
});

export const group4 = writable(browser && localStorage && localStorage.getItem("group4") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
group4.subscribe((val) => {
    if (browser && localStorage) JSON.stringify(localStorage.setItem("group4", val));
});

export const group5 = writable(browser && localStorage && localStorage.getItem("group5") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
group5.subscribe((val) => {
    if (browser && localStorage) JSON.stringify(localStorage.setItem("group5", val));
});

export const group6 = writable(browser && localStorage && localStorage.getItem("group6") || '{"name":"", "level":"", "language":"", "region": "","sliderPosition":[]}');
group6.subscribe((val) => {
    if (browser && localStorage) JSON.stringify(localStorage.setItem("group6", val));
});