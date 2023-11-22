'use strict'

function setInstruction ( dependencies ) {
return function setInstruction ( fn, ...args ) {
    const { askForPromise, deps } = dependencies; 
    return function applyInstruction () {
                    const task = askForPromise ();
                    fn ({ task, dependencies:deps() }, ...args )
                    return task.promise
                } // applyInstruction func.
}} // setInstruction func.



export default setInstruction


