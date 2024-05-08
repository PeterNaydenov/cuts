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
 *      Published on May 8th, 2024;
 * 
 */


import { shortcuts }   from '@peter.naydenov/shortcuts'      // Docs : https://github.com/PeterNaydenov/shortcuts
import askForPromise   from 'ask-for-promise'                // Docs : https://github.com/PeterNaydenov/ask-for-promise
import createLog       from '@peter.naydenov/log'            // Docs : https://github.com/PeterNaydenov/log

import findInstructions from './findInstructions.js'
import setInstruction   from './setInstruction.js'
import methods          from './methods/index.js'





function main ( cfg= {logLevel:0} ) {
     const 
          shortcutMngr = shortcuts ()
        , logLevel = cfg.logLevel || 0
        , log = createLog ({ level:logLevel })
        , state = {     
                     currentScene   : null       // Current scene name;
                   , currentParents : null       // Current scene parents if any;
                   , sceneNames     : new Set () // Set with all loaded scenes;
                   , scenes         : {}         // Collection of all scenes;
                   , opened         : false      // Flag to indicate if the scene manager is opened
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

        Object.entries ( methods ).forEach ( ([name, fn]) => {
                        if ( name.startsWith ( '_' ) )   inAPI[name] = fn ( dependencies, state )
                        else                             API[name]   = fn ( dependencies, state )
                })
        
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
         * @param {*} options - plugin options
         * @returns void
         */
        API.enablePlugin = (plugin,options) => shortcutMngr.enablePlugin ( plugin, options )

        /**
         * @function disablePlugin
         * @description Disable a shortcut plugin
         * @param {string} pluginName - plugin name
         * @returns void
         */
        API.disablePlugin = ( pluginName )  => shortcutMngr.disablePlugin ( pluginName )


        /**
         * @function emit
         * @description Emit an event
         * @param {string} event - event name
         * @param {*} data - event data
         * @returns void
         */
        API.emit = ( event, ...args ) => shortcutMngr.emit ( event, ...args )

        return API
} // main func.



export default main


