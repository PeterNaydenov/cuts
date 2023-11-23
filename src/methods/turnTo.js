'use strict'



function turnTo ( dependencies, state ) {
/**
 * @function turnTo
 * @description Turn to the requested page
 * @param {Object} request - request object
 * @param {string} request.page - requested page name
 * @param {Object} request.options - options object. Optional
 * @param {boolean} request.options.ssr - flag to indicate if the page is already rendered(ssr: server side rendering). Optional
 * @param {Array} args - arguments to pass to the page method. Optional
 * @returns {Promise} - promise that resolves when the process to 'turned to' is completed
 */
return function turnTo ({page:requestedPage, options={ssr:false}}, ...args ) {
    const 
          { pgMngr, askForPromise, log, findInstructions, setInstruction } = dependencies
        , turnToTask = askForPromise ()
        , { opened, pages, pageNames } = state
        ;
        
    if ( !pageNames.has ( requestedPage ) ) {
            if ( log ) {
                            log ({
                                      message: `Page ${requestedPage} is not available.`
                                    , level : 1
                                    , type  : 'error'
                                })
                            turnToTask.done ()
                            return turnToTask.promise
                }
        }

    if ( !opened && options.ssr ) {  // Check for Server side rendering on first page load only
                // Executes only once when the page manager is started
                state.opened = true
                state.currentPage = requestedPage
                pgMngr.changeContext ( requestedPage )
                turnToTask.done ()
                return turnToTask.promise
        }
    
    const { show, parents } = pages[requestedPage];
    if ( parents[0] === '*' ) {
                show ().then ( () => turnToTask.done ()   )
                state.currentParents.push ( state.currentPage )
                state.currentPage = requestedPage
                return turnToTask.promise
        }

    
    let checkParents = parents.forEach ( name => pageNames.has ( name )   ) || true ;
    if ( !checkParents ) {
                if ( log ) {
                                log ({
                                          message: `Some of '${requestedPage}' parent pages are not set.`
                                        , level : 1
                                        , type  : 'error'
                                    })
                    }
                turnToTask.done ()
                return turnToTask.promise
        }

    function getStep ([name, action]) {   // Returns a page function(hide or show) according to instructions
                if ( action === 'show' ) {
                        if ( state.currentPage )   state.currentParents.push ( state.currentPage )
                        state.currentPage = name
                    }
                else {
                        let el = state.currentParents.pop ();
                        state.currentPage = el
                    }
                return pages[name][action]
        } // getStep func.

    if ( !state.currentParents )   state.currentParents = []  
    const 
            g = findInstructions ( state.currentPage, state.currentParents, requestedPage, parents )
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
                        pgMngr.changeContext ( requestedPage )
                        turnToTask.done () 
                })
    return turnToTask.promise
}} // turnTo func.



export default turnTo


