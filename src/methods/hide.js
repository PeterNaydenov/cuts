'use strict'



function hide ( dependencies, state ) {
/**
 * @function hide
 * @description Hide the current scene and returns to the parent one
 * @param {number|string} endSteps - number of steps to end or '*' to end all scenes to the root
 * @returns {Promise} - promise that resolves when the process 'end' is completed
 */
return function hide ( endSteps=1 ) {
    const
          { askForPromise, shortcutMngr, setInstruction } = dependencies
        , { currentScene, currentParents, scenes } = state
        , hideTask = askForPromise ()
        , instructions = []
        , hasParents = currentParents.length > 0
        ;
    let el;
    
    shortcutMngr.pause ()   // Stop all shortcuts
    instructions.push ( setInstruction ( scenes[currentScene].hide ))   // Set instruction to hide current scene

    if ( !hasParents )    state.currentScene = null
    
    if ( hasParents && endSteps === '*' ) {
                [...currentParents].reverse().forEach ( name => {
                                                        el = state.currentParents.at ( -1 )
                                                        state.currentScene = el
                                                        instructions.push ( setInstruction ( scenes[name].hide)) 
                                                })
        }
    if ( hasParents && ![ '*', 1].includes(endSteps) ) {
                currentParents.slice ( `-${endSteps-1}` ).reverse().map ( name => {
                                                        el = state.currentParents.at ( -1 )
                                                        state.currentScene = el
                                                        instructions.push ( setInstruction (scenes[name].hide))
                                                })
        }
    endSteps = askForPromise.sequence ( instructions )
    endSteps.onComplete ( () => {
                    shortcutMngr.changeContext ( state.currentScene )   // If state.currentScene is null, then all shortcuts are switched off and currentContext is null
                    hideTask.done () 
            })
    return hideTask.promise
}} // hide func.



export default hide


