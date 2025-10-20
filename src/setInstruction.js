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
                    return task.promise
                } // applyInstruction func.
}} // setInstruction func.



export default setInstruction


