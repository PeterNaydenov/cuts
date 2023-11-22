'use strict'

/** @type pageDescription
 * @param {string} name - name of the page
 * @param {object} page - object should contain 'show' and 'hide' + shortcuts and action functions
 */

function setPages ( dependencies, state ) {
/**
 * @function setPages
 * @param {Array} pageDescription - list of objects with name and page. Page should contains the JS-page.
 * @returns { void }
 */
return function setPages ( list ) {
    const { pgMngr } = dependencies;
    list.forEach ( ({name, page }) => {
                    state.pages[name] = page
                    state.pageNames.add ( name )
                    if ( !page.parents ) page.parents = []

                    const 
                          { show, hide, ...shortcuts } = page
                        , context = {}
                        ;
                    context[name] = shortcuts
                    pgMngr.load ( context )
            })
}} // setPages func.



export default setPages


