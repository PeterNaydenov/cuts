function jumpsReset ( state ) {
    /**
     * @function jumpsReset
     * @description Reset the jump stack, clearing all saved jump positions
     * @returns {void}
     */
    return function jumpsReset () {
                    state.jumpStack = []
            }
} // jumpsReset func.



export default jumpsReset


