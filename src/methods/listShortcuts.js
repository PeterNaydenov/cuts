'use strict'

function listShortcuts ( dependencies, state ) {
/**
 * @function listShortcuts
 * @description List all shortcuts for js-pages
 * @param {string} pageName - name of the page to list shortcuts for.
 * @returns {(Array.<string>|null)} - list of shortcuts for the page or null if page not found
 */
return function listShortcuts ( pageName ) {
    const { pages, pageNames } = state;
    if ( ! pageNames.has ( pageName ) )   return null
    const { show, hide, parents, ...shortcuts } = pages[pageName];
    return Object.keys ( shortcuts )
}} // listShortcuts func.



export default listShortcuts


