'use strict'



function show ( dependencies, state ) {
/**
 * @function show
 * @description Switch to the requested scene
 * @param {Object} request - request object
 * @param {string} request.scene - requested scene name
 * @param {Object} request.options - options object. Optional
 * @param {boolean} request.options.ssr - flag to indicate if the scene is already rendered(ssr: server side rendering). Optional
 * @param {Array} args - arguments to pass to the scene method. Optional
 * @returns {Promise} - promise that resolves when the process to 'show' is completed
 */
return function show ({scene:requestedScene, options={ssr:false}}, ...args ) {
    const 
          { shortcutMngr, askForPromise, log, findInstructions, setInstruction } = dependencies
        , showTask = askForPromise ()
        , { opened, scenes, sceneNames } = state
        ;
        
    if ( !sceneNames.has ( requestedScene ) ) {
            if ( log ) {
                            log ({
                                      message: `Scene ${requestedScene} is not available.`
                                    , level : 1
                                    , type  : 'error'
                                })
                            showTask.done ()
                            return showTask.promise
                }
        }

    if ( !opened && options.ssr ) {  // Check for Server side rendering on first scene load only
                // Executes only once when the scene manager is started
                state.opened = true
                state.currentPage = requestedScene
                shortcutMngr.changeContext ( requestedScene )
                showTask.done ()
                return showTask.promise
        }
    
    const { show, parents } = scenes[requestedScene];
    
    if ( parents[0] === '*' ) {
                show ().then ( () => showTask.done ()   )
                state.currentParents.push ( state.currentPage )
                state.currentPage = requestedScene
                return showTask.promise
        }
    
    let checkParents = parents.forEach ( name => sceneNames.has ( name )   ) || true ;
    if ( !checkParents ) {
                if ( log ) {
                                log ({
                                          message: `Some of '${requestedScene}' parent scenes are not set.`
                                        , level : 1
                                        , type  : 'error'
                                    })
                    }
                showTask.done ()
                return showTask.promise
        }

    function getStep ([name, action]) {   // Returns a scene function(hide or show) according to instructions
                if ( action === 'show' ) {
                        if ( state.currentScene )   state.currentParents.push ( state.currentScene )
                        state.currentScene = name
                    }
                else {
                        let el = state.currentParents.pop ();
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
                [inst]
                    .map ( getStep )
                    .map ( step => instructions.push ( setInstruction(step),...args ))
                    // Note:  Methods 'show' and 'hide' are async, but we need to provide them a data, 
                    //        so we need to wrap them in a another function that returns a promise
        }
                       
    const goingTask = askForPromise.sequence ( instructions );  // Execute open steps(show and hide) in sequence
    goingTask.onComplete ( () => {
                        state.opened = true
                        shortcutMngr.changeContext ( requestedScene )
                        showTask.done () 
                })
    return showTask.promise
}} // show func.



export default show


