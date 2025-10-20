function jumpsReset ( state ) {
    /**
     * @function jumpsReset
     * @description Reset the jump stack, clearing all saved jump positions
     * @returns {void}
     */
    return function jumpReset () {
                    state.jumpStack = []
            }
} // jumpsReset func.



export default jumpsReset


