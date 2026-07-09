'use strict'



function hide ( dependencies, state ) {
/**
 * @function hide
 * @description Hide the current scene and returns to the parent one
 * @param {number|string} [endSteps=1] - number of steps to end; omit or `1` for current scene only; `'*'` to end all scenes to root
 * @returns {Promise<void>} - promise that resolves when the process 'end' is completed
 */
return function hide ( endSteps=1 ) {
    const
          { askForPromise, shortcutMngr, setInstruction } = dependencies
        , { currentScene, scenes } = state
        , hideTask = askForPromise ()
        , unloadTask = askForPromise ()
        , hasBeforeHide = typeof scenes[currentScene].beforeHide === 'function'
        ;

    if ( hasBeforeHide ) { // Execute 'beforeHide' function if exists - same guard 'show' honors when navigating away
                const closingFn = scenes[currentScene].beforeHide;
                try {
                    const result = closingFn ({ done:unloadTask.done, dependencies: shortcutMngr.getDependencies() });
                    if ( result != null && typeof result.then === 'function' ) {
                        result.then ( unloadTask.done ).catch ( () => unloadTask.done ( false ) );
                    }
                } catch ( err ) {
                    unloadTask.done ( false );
                }
        }
    else  unloadTask.done ( true )

    unloadTask.onComplete ( continueHiding => {
                    if ( !continueHiding ) {
                                // 'beforeHide' returned false - cancel, nothing was torn down or changed
                                hideTask.done ()
                                return hideTask.promise
                        }

                    const
                          instructions = []
                        // Work on a copy of the recorded ancestor chain - it's the source of truth for what to
                        // climb back to, including for wildcard-overlay scenes ('*' itself is never stored here,
                        // only the real scene name that was current when the overlay was shown).
                        , remaining = [ ...state.currentParents ]
                        ;

                    shortcutMngr.pause ()   // Stop all shortcuts
                    instructions.push ( setInstruction ( scenes[currentScene].hide ))   // Hiding the current scene is always at least 1 step

                    const ancestorsToHide = ( endSteps === '*' ) ? remaining.length : Math.min ( endSteps - 1, remaining.length )
                    for ( let i = 0; i < ancestorsToHide; i++ ) {
                                const name = remaining.pop ()
                                instructions.push ( setInstruction ( scenes[name].hide ))
                        }

                    state.currentScene   = remaining.length > 0 ? remaining.pop () : null
                    state.currentParents = remaining

                    const goingTask = askForPromise.sequence ( instructions );
                    goingTask.onComplete ( () => {
                                    shortcutMngr.changeContext ( state.currentScene )   // If state.currentScene is null, then all shortcuts are switched off and currentContext is null
                                    hideTask.done ()
                            })
        }) // unloadTask onComplete
    return hideTask.promise
}} // hide func.



export default hide

