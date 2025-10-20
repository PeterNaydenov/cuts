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
            state.jumpStack.push ( state.currentScene )
            return show ( { scene }, ...args )
        }
    return jump
} // jump func.



export default jump


