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

    shortcutMngr.pause ()   // Stop all shortcuts
    instructions.push ( setInstruction ( scenes[currentScene].hide ))   // Set instruction to hide current scene

    if ( !hasParents )    state.currentScene = null

    let namesToHide = []
    if ( hasParents && endSteps === '*' ) {
                namesToHide = [...currentParents].reverse ()
        }
    if ( hasParents && ![ '*', 1].includes(endSteps) ) {
                namesToHide = currentParents.slice ( `-${endSteps-1}` ).reverse ()
        }

    namesToHide.forEach ( name => {
                instructions.push ( setInstruction ( scenes[name].hide))
                // Climb to the parent of the scene just hidden - same technique 'show' uses for its 'hide' steps.
                state.currentScene   = scenes[name].parents.at ( -1 ) ?? null
                state.currentParents = state.currentScene ? scenes[state.currentScene].parents : []
        })

    const goingTask = askForPromise.sequence ( instructions );
    goingTask.onComplete ( () => {
                    shortcutMngr.changeContext ( state.currentScene )   // If state.currentScene is null, then all shortcuts are switched off and currentContext is null
                    hideTask.done ()
            })
    return hideTask.promise
}} // hide func.



export default hide


