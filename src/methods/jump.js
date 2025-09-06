function jump ( state, show ) {
    function jump ( { scene }, ...args ) {
            state.jumpStack.push ( state.currentScene )
            return show ( { scene }, ...args )
        }
    return jump
} // jump func.



export default jump


