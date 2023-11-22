'use strict'
import shortcuts     from '@peter.naydenov/shortcuts'      // Docs : https://github.com/PeterNaydenov/shortcuts
import askForPromise from 'ask-for-promise'                // Docs : https://github.com/PeterNaydenov/ask-for-promise
import createLog     from '@peter.naydenov/log'            // Docs : https://github.com/PeterNaydenov/log

import findInstructions from './findInstructions.js'
import setInstruction  from './setInstruction.js'
import methods         from './methods/index.js'





// /**
//  * 
//  * @param {function} inFn - import pattern function
//  * @returns function getModules
//  */
// function getModules ( inFn ) {
// const requestModules = dynamicImport ( inFn );
// /**
//  * @param {Array} list - list of objects with name and src
//  * @returns {Promise} - Promise that resolves to an array of JS-pages
//  */
// return function getModules ( list ) {
//     const names = [], srcList = [];
//     list.forEach ( ({name, src}) => {
//                     names.push ( name )
//                     srcList.push ( src )
//             })
//     return requestModules ( srcList )
//                 .then ( ls => names.map ( (name, i) => {
//                                             let d = {}
//                                             if ( ls[i] )   d[name] = ls[i]
//                                             return d
//                                     })
//                     )
// }} // getModules func.









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











// function main () {       
//     const pageManager = shortcuts ();
//     const screenBus = notice ()
//     const 
//               test = { name:'test', src:'first'  }
//             , alt = { name:'alt', src:'second' }
//             , inFn = src => import ( `../js-pages/pg-${src}.js` )
//             ;
//     getModules = getModules ( inFn ) // Apply the import pattern function
//     getModules ( [test] )
//         .then (  jsPageList => {
//                             jsPageList.map ( pg => pageManager.load ( pg )   )
//                             pageManager.setDependencies ( { screenBus } )
//                             pageManager.changeContext ( 'test' )
//                             console.log ( `Available JS-pages: ${pageManager.listContexts ()}` )
//                             return getModules ( [alt] )
//                 })
//         .then ( jsPageList => {
//                             jsPageList.map ( pg => pageManager.load ( pg )   )
//                             console.log ( `Available JS-pages: ${pageManager.listContexts ()}` )
//                 })
    
//     screenBus.on ( 'over', function ( c ) {
//                         console.log ( 'over', c )
//                         pageManager.emit ( 'hide' )
//                         pageManager.pause ('*') // stop all
//                         pageManager.resume ('mouse-click-left-2') // activete onlt this
//                 })

// } // main func.



export default main


