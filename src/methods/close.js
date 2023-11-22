'use strict'



function close ( dependencies, state ) {
/**
 * @function close
 * @description Close the current page and return to the previous one
 * @param {number|string} closeSteps - number of steps to close or '*' to close all pages to the root
 * @returns {Promise} - promise that resolves when the process 'close' is completed
 */
return function close ( closeSteps=1 ) {
    const
          { askForPromise, pgMngr, setInstruction } = dependencies
        , { currentPage, currentParents, pages } = state
        , closeTask = askForPromise ()
        , instructions = []
        , hasParents = currentParents.length > 0
        ;
    let el;
    
    pgMngr.pause ()   // Stop all shortcuts
    instructions.push ( setInstruction ( pages[currentPage].hide ))   // Set instruction to close current page

    if ( !hasParents )    state.currentPage = null
    
    if ( hasParents && closeSteps === '*' ) {
                [...currentParents].reverse().forEach ( name => {
                                                        el = state.currentParents.pop ();
                                                        state.currentPage = el
                                                        instructions.push ( setInstruction ( pages[name].hide)) 
                                                })
        }
    if ( hasParents && ![ '*', 1].includes(closeSteps) ) {
                currentParents.slice ( `-${closeSteps-1}` ).reverse().map ( name => {
                                                        el = state.currentParents.pop ();
                                                        state.currentPage = el
                                                        instructions.push ( setInstruction (pages[name].hide))
                                                })
        }
    closeSteps = askForPromise.sequence ( instructions )
    closeSteps.onComplete ( () => {
                    pgMngr.changeContext ( state.currentPage )   // If state.currentPage is null, then all shortcuts are switched off and currentContext is null
                    closeTask.done () 
            })
    return closeTask.promise
}} // close func.



export default close


