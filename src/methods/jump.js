function jump ( state, show ) {
    /**
     * @function jump
     * @description Jump to a scene, saving the current scene on the jump stack for later return
     * @param {Object} request - request object
     * @param {string} request.scene - target scene name
     * @param {Array} [args] - arguments to pass to the scene method
     * @returns {Promise} - promise that resolves when the jump is completed
     */
    function jump ( { scene }, ...args ) {
            const previousScene = state.currentScene
            return show ( { scene }, ...args ).then ( () => {
                        // Only record the jump if it actually landed - 'show' silently no-ops on a
                        // blocked (beforeHide) or invalid navigation, and pushing anyway would leave
                        // a phantom entry that desyncs jumpBack() from what actually happened.
                        if ( state.currentScene === scene )   state.jumpStack.push ( previousScene )
                })
        }
    return jump
} // jump func.



export default jump


