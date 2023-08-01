import { writable } from "svelte/store"
import { browser } from "$app/environment"

export const selectedGroup6 = writable(browser && localStorage && localStorage.getItem("selectedGroup6") || "6")
selectedGroup6.subscribe((val) => {
    if(browser && localStorage) localStorage.setItem("selectedGroup6", val)
});

export const gradeBoundary = writable(browser && localStorage && localStorage.getItem("gradeBoundary") || "M22")
gradeBoundary.subscribe((val) => {
    if(browser && localStorage) localStorage.setItem("gradeBoundary", val)
});