'use strict'
/**
 *  Screen Writer
 *  ===============
 *  
 *  A simple JS-pages manager.
 *  
 *  History notes:
 *    - Published on gitHub for the first time on 2023-11-24
 * 
 */


import shortcuts     from '@peter.naydenov/shortcuts'      // Docs : https://github.com/PeterNaydenov/shortcuts
import askForPromise from 'ask-for-promise'                // Docs : https://github.com/PeterNaydenov/ask-for-promise
import createLog     from '@peter.naydenov/log'            // Docs : https://github.com/PeterNaydenov/log

import findInstructions from './findInstructions.js'
import setInstruction  from './setInstruction.js'
import methods         from './methods/index.js'





function main ( cfg= {logLevel:0} ) {
     const 
          pgMngr = shortcuts ()
        , logLevel = cfg.logLevel || 0
        , log = createLog ({ level:logLevel })
        , state = {     
                     currentPage   : null       // Current page name;
                   , currentParents: null       // Current page parents if any;
                   , pageNames     : new Set () // Set with all loaded JS-pages;
                   , pages         : {}         // Collection of all pages
                   , opened        : false      // Flag to indicate if the page manager is opened
                }
        , API = {}
        , inAPI = {}
        , dependencies = { 
                             pgMngr
                           , API
                           , inAPI
                           , findInstructions
                           , askForPromise
                           , setInstruction : setInstruction ({ askForPromise, deps: pgMngr.getDependencies })
                           , log
                        }
        ;

        Object.entries ( methods ).forEach ( ([name, fn]) => {
                        if ( name.startsWith ( '_' ) )   inAPI[name] = fn ( dependencies, state )
                        else                             API[name]   = fn ( dependencies, state )
                })
        
        /**
         * @function setDependencies
         * @description Set dependencies for the JS-pages
         * @param {*} deps - dependencies objects
         * @returns void
         */
        API.setDependencies = deps  => pgMngr.setDependencies ( deps )

        /**
         * @function getDependencies
         * @description Get dependencies for the JS-pages
         * @returns {*} - dependencies objects
         */
        API.getDependencies = () => pgMngr.getDependencies ()

        /**
         * @function setNote
         * @param {string} note - note, provided to action functions
         * @returns void
         */
        API.setNote         = note => shortcuts.setNote ( note )


        /**
         * @function listPages
         * @description List all loaded JS-pages names
         * @returns {Array.<string>} - list of JS-pages names
         */
        API.listPages = () => [ ...state.pageNames ]

        return API
} // main func.



export default main


