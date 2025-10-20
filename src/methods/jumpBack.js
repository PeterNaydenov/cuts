function jumpBack ( state, show ) {
    /**
     * @function jumpBack
     * @description Jump back to a previous scene from the jump stack
     * @param {Object} [options] - options object
     * @param {number} [options.hops=1] - number of hops to jump back
     * @param {Array} [args] - arguments to pass to the scene method
     * @returns {Promise|undefined} - promise that resolves when the jump back is completed, or undefined if no scenes in stack
     */
    function jumpBack ({hops}={hops:1}, ...args ) {
            for ( let i = 0; i < hops-1; i++ ) {
                    state.jumpStack.pop ()
                }
            if  ( state.jumpStack.length === 0 ) return
            const lastScene = state.jumpStack.pop ();
            return show ( { scene : lastScene }, ...args )
        }
    return jumpBack
} // jumpBack func.


export default jumpBack


