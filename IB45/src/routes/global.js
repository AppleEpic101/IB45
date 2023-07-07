

export function getStorage(name, defaultValue) {
    if(typeof localStorage !== 'undefined' && localStorage.get(name) === null)
        return defaultValue;
    else {
        return localStorage.get(name);
    }
}

export function setStorage(name, value) {
    console.log("setStorage: " + name + " " + value)
    if(typeof window !== "undefined" && window.localStorage) 
        localStorage.setItem(name, value)
    else {
        console.log("NIGGA 2");
    }
}