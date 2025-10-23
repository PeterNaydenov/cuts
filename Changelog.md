# Release History


## 1.6.0 ( 2025-10-?? )
- [x] All 'cuts' errors goes to '@app-error' event;
- [x] Configuration 'logLevel' default value is 1. If you want to dissable errors logging, set 'logLevel' to 0;
- [x] Code cleaning. Removing unused code;
- [x] Test code coverage on 85%;
- [x] Fix: SSR option for first scene loading;




## 1.5.0 ( 2025-10-23 )
- [x] Dependency update. @peter.naydenov/shortcuts - v.3.5.1
- [x] Dev dependency update. Vitest - v.4.0.1
- [x] Cuts has event '@app-error'. Shortcut errors will trigger this event;
- [x] Type improvements;
- [x] New method `getState` returns an object with the current state;
- [x] Fix: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.4 ( 2025-10-10)
- [x] Dependency update. @peter.naydenov/shortcuts - v.3.3.1 ( fixing problem with 'key:specialCharacters' events);
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.3 ( 2025-09-30)
- [x] Dependency update. ask-for-promise@3.0.2;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.2 ( 2025-09-29)
- [x] Dependency update. @peter.naydenov/shortcuts@3.3.0;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



## 1.4.1. ( 2025-09-24)
- [x] Fix: Cleaning a duplicated line of code in main.js;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.4.0 ( 2025-09-06)
- [x] New methods: jump, jumpBack, jumpsReset;
- [ ] Bug: Duplicated line of code in main.js;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.3.1 ( 2025-08-15)
- [ ] Fix: Missing typedef for plugin 'form'
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.3.0 ( 2025-08-15)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.5. Plugin 'form' is available;
- [ ] Miss: Missing typedef for plugin 'form'
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


## 1.2.8 ( 2025-05-03)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.4;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.7 ( 2025-02-04)
- [x] Dependency update. @peter.naydenov/log@1.1.1;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.6 ( 2025-01-23)
- [x] Improve: Warn that the scene is not defined if scene is set to null;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.4 ( 2025-01-15)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.3;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.2.3 ( 2024-12-23)
- [x] Dependency update. @peter.naydenov/shortcuts@3.1.2;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


### 1.2.2 ( 2024-12-22 )
- [x] Fix: Wrong argument 'dependencies' for 'beforeHide' and 'afterShow' methods;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;

### 1.2.1 ( 2024-12-21 )
- [x] Fix: Wrong settings if missing 'beforeHide' method;
- [ ] Bug: Wrong argument 'dependencies' for 'beforeHide' and 'afterShow' methods;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;


### 1.2.0 (2024-12-21)
- [x] Extend 'scene' with optional 'afterShow' and 'beforeHide' methods;
- [ ] Bug: Wrong settings if missing 'beforeHide' method;
- [ ] Bug: Wrong argument 'dependencies' for 'beforeHide' and 'afterShow' methods;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.1.0 (2024-12-13)
- [x] Type improvements;
- [x] Refactoring related to types;
- [x] New method `loadPlugins` to load shortcut plugins: `Key`, `Click` or both;
- [x] Method 'setScene' errors goes to '@app-error'
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.0.2 (2024-12-12)
- [x] Create d.ts files in folder 'types';
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.0.1 (2024-05-10)
- [x] Fix: Repository address in package.json;
- [ ] Bug: Closing a long list of scenes breaks the state;
- [ ] Bug: SSR option for first scene loading;



### 1.0.0 (2024-05-08)
- [x] Initial release;


