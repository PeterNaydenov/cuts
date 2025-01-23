'use strict'


/**
 * @typedef {Object} SceneObject
 * @param {function} show - load interface and prerequisites for the scene;
 * @param {function():boolean} [afterShow] - run after scene is loaded. Optional. Returns true to continue loading, false to cancel;
 * @param {function():void} hide - Reverse the settings from 'show';
 * @param {function():void} [beforeHide] - Run before scene is hidden. Optional;
 * @param {Array.<string>} [parents] - list of parent scene names.
 * @param {*} ... - shortcut descriptions
 */



/** 
 * @typedef {Object} sceneDescription
 * @param {string} name - name of the scene
 * @param {SceneObject} scene - object should contain 'show' and 'hide' + shortcuts and action functions
 */




function setScenes ( dependencies, state ) {
    /**
     * @function setScenes
     * @param {SceneDescription[]} list - list of objects with name and scene. Scene should be a Scene model.
     * @returns void
     * @description Screen Description is an object with fields 'name' and 'scene'
     */
    return function setScenes ( list ) {
    const { shortcutMngr } = dependencies;
    list.forEach ( item => {
                    if ( item == null ) return
                    const {name, scene } = item;
                    if ( scene == null ) {
                            console.warn ( `Scene ${name} is not defined` )
                            return
                      }
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


