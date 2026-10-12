function jumpBack ( state, show ) {
    /**
     * @function jumpBack
     * @description Jump back to a previous scene from the jump stack
     * @param {Object} [options] - options object
     * @param {number} [options.hops=1] - number of hops to jump back
     * @param {Array} [args] - arguments to pass to the scene method
     * @returns {Promise|undefined} - promise that resolves when the jump back is completed, or undefined if the stack has fewer than 'hops' entries
     */
    function jumpBack ( { hops = 1 } = {}, ...args ) {
            if ( state.busy )   return Promise.resolve ()   // Ignored while navigating - keep the jump stack untouched
            const ix = state.jumpStack.length - Math.max ( 1, hops );
            if ( ix < 0 )   return
            const lastScene = state.jumpStack[ix];
            return show ( { scene : lastScene }, ...args )
                        .then ( () => {
                                // Remove the entries only if navigation landed - a 'beforeHide' that blocks
                                // the jump back must leave the stack as it was, so Back can be retried.
                                if ( state.currentScene === lastScene )   state.jumpStack.length = ix
                            })
                        .catch ( () => {} )   // Swallow rejections so they don't become unhandled
        }
    return jumpBack
} // jumpBack func.


export default jumpBack


