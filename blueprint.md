## Name
- director
- script
- screen-writer



## TODO

- Provide data to `turnTo` method. This data will be passed to the `show` method of the JS-page;
- Demo app, event based change of pages;
- Use same shortcut definition for different pages. Check if it's possible;

The process of writing a script involves careful consideration of the dramatic elements, character development, dialogue, and visual aspects that will contribute to the overall success of the performance or production. The script serves as a blueprint for directors, actors, and other members of the production team to bring the story to life on the stage or screen.




# Description
Library to manage SPA screen-states and coresponding user interactions by using JS-pages. 


JS-page is a object model that contains all shortcuts and mouse interactions with the screen, also the rendering instructions for the page.



JS-page is a set of instructions how the visual html page should interact with the customer. All this instructions are coming in package called `JS-page`. The library `js-pages` is a tool to switch between your jsPage packages according different contexts.
as a state
Dynamic rendering of JS-pages and provides a controlable context to 
 over client interaction with the interface.
control over page events with simplified controler.




## Modules
- screen app: Small fsm app, that will load, unload jsPages. Will keep also a SSR state flag. If SSR is true will not execute the jsPage load function; 
- jsPage loader: will load dynamically the jsPage from es modules;
- dependencies object:?



Screen App States
- initial: not started yet;
- rendered: Static html is ready. Don't execute 'loading' JS-page, just change the context;
- active: Load the JS-page;
- go-down: Using hide methods until common parent is found; 
- go-up:  Using show methods from common parent until the target is reached;
- sleep: No JS-page is active;




Methods:

(autoLoader for JS-pages)
- setPageLocation: Set a list of names and location JS-pages(used by loadPages method);
- setImportPatternFunction: Set a function that will be used to import the JS-page;
- loadPages: Will load list of JS-pages from ES modules. Returns a promise;
(--- autoLoader for JS-pages ---)


- setPages : - provide list of JS-pages to the app;

- turnTo: Change the current JS-page;
- close : Close the current JS-page;

- listPages: List of loaded JS-pages;
- listShortcuts: List shortcuts per JS-page;
- setNote: Set a note to the current JS-page (like a sub-context of current page);
- setDependencies: Add object to the dependencies object. This object will be passed to the JS-page load function;
- getDependencies: Return the dependencies object;
- onMissingPage: Set a function that will be called when the page is missing;
