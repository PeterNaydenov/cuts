'use strict'

function setInstruction ( dependencies ) {
return function setInstruction ( fn ) {
    const { askForPromise, deps } = dependencies; 
    return function hide () {
                    const task = askForPromise ();
                    fn ({ task, dependencies:deps() })
                    return task.promise
                }
}} // setInstruction func.



export default setInstruction


