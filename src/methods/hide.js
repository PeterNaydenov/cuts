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

    if ( hasParents && namesToHide.length === 0 && scenes[currentScene].parents[0] === '*' ) {
                // A wildcard overlay has no fixed scene to 'stay pointed at' once hidden - unlike a
                // regular single-step hide(), always climb back to whatever scene it was shown on top
                // of, so the shortcuts context returns to the (still visible) underlying scene.
                state.currentScene   = state.currentParents.pop ()
                state.currentParents = state.currentScene ? [ ...scenes[state.currentScene].parents ] : []
        }

    namesToHide.forEach ( name => {
                instructions.push ( setInstruction ( scenes[name].hide))
                // Climb to the parent of the scene just hidden - same technique 'show' uses for its 'hide' steps.
                // A wildcard overlay isn't climbing its own declared parent ('*' isn't a real scene) - and
                // there's no reliable way to recover what it originally covered once it's this deep in the
                // chain, so fall back to treating it as the end of the chain rather than crashing.
                state.currentScene   = ( scenes[name].parents[0] === '*' )
                                            ? null
                                            : ( scenes[name].parents.at ( -1 ) ?? null )
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


