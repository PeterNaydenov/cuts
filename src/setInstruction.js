'use strict'

function setInstruction ( dependencies ) {
    /**
     * @function setInstruction
     * @description Wrap a scene function (show/hide) to return a promise-based instruction
     * @param {function} fn - the scene function to wrap
     * @param {...*} args - arguments to pass to the scene function
     * @returns {function} - a function that returns a promise when executed
     */
return function setInstruction ( fn, ...args ) {
    const { askForPromise, deps } = dependencies; 
    return function applyInstruction () {
                    const task = askForPromise ();
                    fn ({ task, dependencies:deps() }, ...args )
                    // Swallow unhandled rejections from scene functions — the promise resolves
                    // as normal (via task.done() inside the scene), but if the scene throws or
                    // returns a rejected promise without catching, this prevents an unhandled
                    // rejection at the process level.
                    return task.promise.catch ( () => {} )
                } // applyInstruction func.
}} // setInstruction func.



export default setInstruction


