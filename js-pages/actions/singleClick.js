function singleClick ({ dependencies, target } ) {
    if ( target == null ) return
    const { screenBus } = dependencies;
    if ( target.dataset.click === 'count' ) {
                const c = parseInt (target.innerHTML);
                if ( c >= 5 ) {
                        screenBus.emit ( 'over', c )
                        return
                    }
                target.innerHTML = c + 1;   
        }
} // singleClick func.


export default singleClick


