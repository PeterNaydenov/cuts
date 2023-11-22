import singleClick from './actions/singleClick.js'
import doubleClick from './actions/doubleClick.js'



const jsPage = {
    'mouse-click-left-1' : singleClick
  , 'mouse-click-left-2' : doubleClick
  , 'show' : function show () {
                              const btn = document.querySelector ( '#counter' )
                      } // show func.
  , 'hide' : function hide ( {screenBus} ) {
                          console.log ( screenBus )
                          const btn = document.querySelector ( '#counter' )
                      }                    
}



export default jsPage


