/**
 * Constructs a URL with query parameters.
 * @param {URL} url - The base URL object.
 * @param {string} short - Short code for the subject.
 * @param {string} lang - Language (optional).
 * @param {string} lvl - Level (SL/HL).
 * @returns {URL} The modified URL object.
 */
export const constructURL = (url, short, lang, lvl) => {
    url.pathname = '/subjects/' + short;
    if (lang) url.searchParams.set('lang', lang);
    url.searchParams.set('lvl', lvl);
    return url;
}
