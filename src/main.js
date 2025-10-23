'use strict'
/**
 *  Cuts
 *  ===============
 *  
 *  SPA Scene manager.
 *  
 *  History notes:
 *    - Started as @peter.naydenov/screen-writer on gitHub for the first time on 2023-11-24;
 *    - Version 2.0.0 of screen-writer. Works with shortcuts@3.0.1. Published on March 6th, 2024;
 *    - Rename to @peter.naydenov/cuts 
 *      Changes in documentation and some methods were renamed accordingly. 
 *      Version 1.0.0. 
 *      Published for first time as package '@peter.naydenov/cuts' on May 8th, 2024;
 *      Extend 'scene' with optional 'afterShow' and 'beforeHide' methods. December 21st, 2024;
 *    - Shortcuts@3.2.x. Plugin 'form' is available. August 15th, 2025;
 */


import { shortcuts }   from '@peter.naydenov/shortcuts'      // Docs : https://github.com/PeterNaydenov/shortcuts
import askForPromise   from 'ask-for-promise'                // Docs : https://github.com/PeterNaydenov/ask-for-promise
import createLog       from '@peter.naydenov/log'            // Docs : https://github.com/PeterNaydenov/log

import findInstructions from './findInstructions.js'
import setInstruction   from './setInstruction.js'


import hide          from './methods/hide.js'
import listShortcuts from './methods/listShortcuts.js'
import setScenes     from './methods/setScenes.js'
import show          from './methods/show.js'
import jump          from './methods/jump.js'
import jumpBack      from './methods/jumpBack.js'
import jumpsReset    from './methods/jumpsReset.js'


function main ( cfg= {logLevel:0} ) {
     const 
          shortcutMngr = shortcuts ({ errorEventName: '@app-error' })
        , logLevel = cfg.logLevel || 1
        , log = createLog ({ level:logLevel }, (arg) => {
                                            const { type } = arg;
                                            if ( type === 'error' ) {  
                                                      shortcutMngr.emit ( '@app-error', arg )
                                                  }
                                      })
        , state = {     
                     currentScene   : null       // Current scene name;
                   , currentParents : null       // Current scene parents if any;
                   , sceneNames     : new Set () // Set with all loaded scenes;
                   , scenes         : {}         // Collection of all scenes;
                   , opened         : false      // Flag to indicate if the scene manager is opened
                   , jumpStack      : []         // Stack of jump instructions
                }
        , API = {}
        , inAPI = {}
        , dependencies = { 
                             shortcutMngr
                           , API
                           , inAPI
                           , findInstructions
                           , askForPromise
                           , setInstruction : setInstruction ({ askForPromise, deps: shortcutMngr.getDependencies })
                           , log
                        }
        ;

        API.hide          = hide ( dependencies, state )
        API.listShortcuts = listShortcuts ( dependencies, state )
        API.setScenes     = setScenes ( dependencies, state )
        API.show          = show ( dependencies, state )
        API.jump          = jump ( state, API.show )
        API.jumpBack      = jumpBack ( state, API.show )
        API.jumpsReset    = jumpsReset ( state )

        /**
         * @typedef {'Key'|'Click'|'Form' } pluginNames
         * @description List of possible plugin names: 'Key', 'Click', 'Form'
         * 
         * Load a needed shortcut plugins - 'Key', 'Click', 'Form' and so on.
         * It's a async function. Don't forget to 'await' it.
         * @function loadPlugins
         * @param {Array.<pluginNames>} plugins - list of plugins to load
         * @returns {Promise.<function[]>} - loaded plugins in a sequence
         * 
         * @example
         * // script is instance of cuts
         * await script.loadPlugins ( ['Key', 'Click'] )
         *             .then ( plugins => plugins.forEach ( plugin => script.enablePlugin ( plugin ) ) )
         */
        API.loadPlugins = async function loadPlugins ( plugins ) {
                                        const pl = plugins.map ( name => `plugin${name}`);
                                        const module = await import ( '@peter.naydenov/shortcuts')
                                        return pl.map ( name => module[name] )
                                } // loadPlugins func.
        
        /**
         * @function setDependencies
         * @description Set dependencies for the Scenes
         * @param {*} deps - dependencies objects
         * @returns void
         */
        API.setDependencies = deps  => shortcutMngr.setDependencies ( deps )

        /**
         * @function getDependencies
         * @description Get dependencies for the Scenes
         * @returns {*} - dependencies objects
         */
        API.getDependencies = () => shortcutMngr.getDependencies ()

        /**
         * @function setNote
         * @param {string} note - note, provided to action functions
         * @returns void
         */
        API.setNote         = note => shortcuts.setNote ( note )

        /**
         * @function listScenes
         * @description List all loaded Scene names
         * @returns {Array.<string>} - list of scene names
         */
        API.listScenes = () => [ ...state.sceneNames ]

        /**
         * @function enablePlugin
         * @description Enable a shortcut plugin
         * @param {function} plugin - plugin library
         * @param {*} [options] - plugin options
         * @returns void
         */
        API.enablePlugin = (plugin,options) => shortcutMngr.enablePlugin ( plugin, options )

        /**
         * Disable a shortcut plugin
         * @function disablePlugin
         * @param {string} pluginName - plugin name
         * @returns void
         */
        API.disablePlugin = ( pluginName )  => shortcutMngr.disablePlugin ( pluginName )
        
        /**
         * Get the current state of the application
         * @function getState
         * @returns {Object} with properties:
         *  - scene: current scene name
         *  - parents: current parent scene names
         *  - opened: boolean indicating if the application is opened
         */
        API.getState = () =>  ({
                                 scene   : state.currentScene
                               , parents : state.currentParents
                               , opened  : state.opened
                            })


         /**
          * @function emit
          * @description Emit an event
          * @param {string} event - event name
          * @param {...*} args - Extra data to pass to the listeners
          * @returns void
          */
        API.emit = ( event, ...args ) => shortcutMngr.emit ( event, ...args )
        return API
} // main func.



export default main


