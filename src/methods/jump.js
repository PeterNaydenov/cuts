function jump ( state, show ) {
    function jump ( name, ...args ) {
            state.jumpStack.push ( state.currentScene )
            return show ( { scene : name }, ...args )
        }
    return jump
} // jump func.



export default jump


