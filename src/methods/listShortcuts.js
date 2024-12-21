'use strict'

function listShortcuts ( dependencies, state ) {
/**
 * @function listShortcuts
 * @description List all shortcuts for Scene
 * @param {string} sceneName - name of the scene to list shortcuts for.
 * @returns {(Array.<string>|null)} - list of shortcuts for the scene or null if scene is not found
 */
return function listShortcuts ( sceneName ) {
    const { scenes, sceneNames } = state;
    if ( ! sceneNames.has ( sceneName ) )   return null
    const { show, hide, parents, beforeUnload, afterLoad,  ...shortcuts } = scenes[sceneName];
    return Object.keys ( shortcuts )
}} // listShortcuts func.



export default listShortcuts


