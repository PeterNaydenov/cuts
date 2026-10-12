'use strict'


/**
 * @function findInstructions
 * @description Generator that yields instructions for transitioning between scenes
 * @param {string|null} currentName - current scene name
 * @param {Array.<string>} currentParents - current scene parents
 * @param {string} targetName - target scene name
 * @param {Array.<string>} targetParents - target scene parents
 * @yields {Array.<string, 'show'|'hide'>} - instruction array with scene name and action
 */
function* findInstructions ( currentName, currentParents, targetName, targetParents ) {
    let backToName, backIndex=null;

    if ( currentName === null ) {   // When the scene manager is just started
            yield* targetParents.map ( name => [ name, 'show' ])
            yield [ targetName, 'show' ]
            return
        }

    if ( currentParents && currentParents.includes ( targetName ) ) {   // Target is already open underneath. Hide down to it, don't show it again.
            yield [ currentName, 'hide' ]
            let index = currentParents.indexOf ( targetName );
            let filtered = currentParents.filter ( (x,i) => i > index )
            filtered.reverse ()
            yield* filtered.map ( name => [ name, 'hide' ])
            return
        }

    if ( targetParents.length === 0 ) {  // Need to close all current parents, then open the target
            yield [ currentName, 'hide' ]
            let cp = [...currentParents]
            cp.reverse ()
            yield* cp.map ( name => [ name, 'hide' ])
            yield [ targetName, 'show'   ]
            return
        }

    if ( targetParents.includes ( currentName ) ) {   // Target is a subscene of the current scene. No closing needed.
            let id = targetParents.indexOf ( currentName );
            for ( let i = id+1; i < targetParents.length; i++ ) {
                    yield [ targetParents[i], 'show' ]
                }
            yield [ targetName, 'show' ]
            return
        }

    if ( !currentParents ) {
            yield [ currentName, 'hide' ]
            yield* targetParents.map ( name => [ name, 'show' ])
            return
        }

    targetParents.every ( (name,i) => {
                if ( currentParents[i] === targetParents[i] ) {  
                            backToName = name
                            backIndex = i
                            return true
                    }
                else {
                            return false
                    }
        })

    if ( backIndex == null ) { // different branches  - close all current parents, then open the target branch
                yield [ currentName, 'hide' ]
                currentParents.reverse ()
                yield* currentParents.map ( name => [ name, 'hide' ])
                yield* targetParents.map ( name => [ name, 'show' ])
                yield [ targetName, 'show' ]
                return
        }

    
    yield [ currentName, 'hide' ]
    for ( let i = currentParents.length; i > backIndex+1; i-- ) {
                yield [ currentParents[i-1], 'hide' ]
        }
    for ( let i = backIndex+1; i < targetParents.length; i++ ) {
                yield [ targetParents[i], 'show' ]
        }
    yield [ targetName, 'show' ]
} // findInstructions func.



export default findInstructions


