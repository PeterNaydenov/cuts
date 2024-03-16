# Release History


### 2.1.0 ( 2024-03-16)
- [x] Updated `@peter.naydenov/shortcuts` to version 3.1.1;
- [x] If action function returns a string 'stop', the execution of the action chain will be stopped. Wildcard '*' events also will be stopped;




### 2.0.0 ( 2024-03-06)
- [x] New method `emit` to emit an custom event;
- [x] Actually changes in version 1.1.0 require a major version change because of change of shortcut description format. Also shortcuts plugins need to be enabled. Version 2.0.0 is coming to fix this issue;




### 1.1.0 ( 2024-03-06)
- [x] Library works with v.3.0.1 of `@peter.naydenov/shortcuts` package
- [x] New method `enablePlugin` to enable the shortcut plugins;
- [x] New method `disablePlugin` to disable the shortcut plugins;
- [x] Package.json: "exports" section was added. Allows you to use package as commonjs or es6 module without additional configuration;
- [x] Folder `dist` was added to the package;
- [x] Rollup was added to the project. Used to build the library versions;



## 0.0.1 ( 2023-11-23 )
- [x] Initial release