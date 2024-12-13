'use strict'

/** 
 * @typedef {Object} sceneDescription
 * @param {string} name - name of the scene
 * @param {object} scene - object should contain 'show' and 'hide' + shortcuts and action functions
 */




function setScenes ( dependencies, state ) {
    /**
     * @function setScenes
     * @param {ScreenDescription[]} list - list of objects with name and scene. Scene should be a Scene model.
     * @returns void
     * @description Screen Description is an object with fields 'name' and 'scene'
     */
    return function setScenes ( list ) {
    const { shortcutMngr } = dependencies;
    list.forEach ( ({name, scene }) => {
                    if ( !scene.parents ) scene.parents = []
                    state.scenes[name] = scene
                    state.sceneNames.add ( name )
                    
                    const 
                          { show, hide, parents, ...shortcuts } = scene
                        , context = {}
                        ;
                    
                    context[name] = shortcuts
                    shortcutMngr.load ( context )
            })
      
}} // setScenes func.



export default setScenes


