function jumpBack ( state, show ) {
    function jumpBack ({hops}={hops:1}, ...args ) {
            // console.log ( hops )

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


