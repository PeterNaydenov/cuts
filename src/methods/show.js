'use strict'



function show ( dependencies, state ) {
/**
 * Switch to the scene with the requested name
 * @function show
 * @param {Object} request - request object
 * @param {string} request.scene - requested scene name
 * @param {Object} [request.options] - options object. (Optional)
 * @param {boolean} request.options.ssr - flag to indicate if the scene is already rendered(ssr: server side rendering). Optional
 * @param {Array} [args] - arguments to pass to the scene method. (Optional)
 * @returns {Promise} - promise that resolves when the process to 'show' is completed
 */
 function show ({scene:requestedScene, options={ssr:false}}, ...args ) {
    const 
          { shortcutMngr, askForPromise, log, findInstructions, setInstruction } = dependencies
        , showTask = askForPromise ()
        , unloadTask = askForPromise ()
        , { opened, scenes, sceneNames, currentScene } = state
        , hasBeforeHide = currentScene && (typeof scenes[currentScene].beforeHide === 'function')
        ;

    if ( hasBeforeHide ) { // Execute 'beforeUnload' function if exists
                const closingFn = scenes[currentScene].beforeHide;
                // TODO: If async elements in beforeUnload, we will 
                // need full unloadTask and function should return a promise
                closingFn ({ done:unloadTask.done, dependencies: shortcutMngr.getDependencies() })
        } // if currentPage
    else  unloadTask.done ( true )


    unloadTask.onComplete ( continueLoading => {
                    if ( !continueLoading ) { 
                                // if the 'beforeUnload' function returns false
                                // Cancel loading the new scene
                                showTask.done ()
                                return showTask.promise
                        }
                        
                    if ( !sceneNames.has ( requestedScene ) ) {
                                log ({
                                          message: `Scene "${requestedScene}" is not available.`
                                        , level : 1
                                        , type  : 'error'
                                    })
                                showTask.done ()
                                return showTask.promise
                        }
                        
                    if ( !opened && options.ssr ) {  // Check for Server side rendering on first scene load only
                                // Executes only once when the scene manager is started
                                state.opened = true
                                state.currentPage = requestedScene
                                shortcutMngr.changeContext ( requestedScene )
                                showTask.done ()
                                return showTask.promise
                        }
                    
                    const { show, parents=[] } = scenes[requestedScene];
                    
                    if ( parents[0] === '*' ) {
                                show ().then ( () => showTask.done ()   )
                                state.currentParents.push ( state.currentPage )
                                state.currentPage = requestedScene
                                return showTask.promise
                        }
                    
                    let checkParents = parents.forEach ( name => sceneNames.has ( name )   ) || true ;
                    
                    if ( !checkParents ) {
                                log ({
                                          message: `Some of '${requestedScene}' parent scenes are not set.`
                                        , level : 1
                                        , type  : 'error'
                                    })
                                showTask.done ()
                                return showTask.promise
                        }

                     function getStep ([name, action]) {   // Returns a scene function(hide or show) according to instructions
                                if ( action === 'show' ) {
                                        if ( state.currentScene )   state.currentParents = [...scenes[state.currentScene].parents]
                                        state.currentScene = name
                                    }
                                else {
                                        let el = scenes[name].parents.at ( -1 )
                                        state.currentScene = el
                                    }
                                return scenes[name][action]
                        } // getStep func.

                    if ( !state.currentParents )   state.currentParents = []  
                    const 
                          g = findInstructions ( state.currentScene, state.currentParents, requestedScene, parents )
                        , instructions = []
                        ;

                     for ( let inst of g ) {
                                 const step = getStep ( inst )
                                 instructions.push ( setInstruction(step, ...args) )
                                     // Note:  Methods 'show' and 'hide' are async, but we need to provide them a data,
                                     //        so we need to wrap them in a another function that returns a promise
                         }
                    const goingTask = askForPromise.sequence ( instructions );  // Execute open steps(show and hide) in sequence
                    
                    goingTask.onComplete ( () => {
                                        state.opened = true
                                        state.currentPage = requestedScene
                                        state.currentParents = scenes[requestedScene].parents || null 
                                        shortcutMngr.changeContext ( requestedScene )                                        
                                        if ( typeof scenes[requestedScene].afterShow === 'function' )   scenes[requestedScene].afterShow ({ dependencies: shortcutMngr.getDependencies(), done: () => {} })
                                        showTask.done () 
                                })
        }) // unloadTask onComplete
    return showTask.promise
    } // show func.
    return show
} // show func.



export default show


