'use strict'


/**
 * @typedef {Object} SceneObject
 * @property {function} show - load interface and prerequisites for the scene;
 * @property {function():boolean} [afterShow] - run after scene is loaded. Optional. Returns true to continue loading, false to cancel;
 * @property {function():void} hide - Reverse the settings from 'show';
 * @property {function():void} [beforeHide] - Run before scene is hidden. Optional;
 * @property {Array.<string>} [parents] - list of parent scene names.
 * @property {*} ... - shortcut descriptions
 */



/**
 * @typedef {Object} sceneDescription
 * @property {string} name - name of the scene
 * @property {SceneObject} scene - object should contain 'show' and 'hide' + shortcuts and action functions
 */




function setScenes ( dependencies, state ) {
     /**
      * @function setScenes
      * @param {sceneDescription[]} list - list of objects with name and scene. Scene should be a Scene model.
      * @returns void
      * @description Screen Description is an object with fields 'name' and 'scene'
      */
    return function setScenes ( list ) {
    const { shortcutMngr, log } = dependencies;
    list.forEach ( item => {
                    if ( item == null ) return
                    const {name, scene } = item;
                    if ( scene == null ) {
                             log ({
                                          message: `Scene ${name} is not defined`
                                        , level : 1
                                        , type  : 'error'
                                    })
                            return
                      }
                    if ( ! scene.parents )   scene.parents = []
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


