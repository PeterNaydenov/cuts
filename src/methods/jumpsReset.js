function jumpsReset ( state ) {
    return function jumpReset () {
                    state.jumpStack = []
            }
} // jumpsReset func.



export default jumpsReset


