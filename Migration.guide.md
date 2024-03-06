# Migration Guides


## From v.1.x.x to v.2.x.x

Main change is related to version 3.0.0 of `@peter.naydenov/shortcuts` package. The shortcuts description format was changed. Also shortcuts plugins need to be enabled. Version 2.0.0 is coming to fix this issue.



### Shortcuts
```js
// old version
'ctrl+a' : () => {
                    // do something
            }
// new version
'key:ctrl+a' : () => {
                    // do something
            }
// <plugin-prefix>: <key> is the new format
```

### Shortcut plugins

In version 2 of `screen-writer`, shortcuts is started without any plugins. You need to enable the plugins you want to use. 

```js
import { pluginClick, pluginKey } from '@peter.naydenov/shortcuts'
const script = screenWriter ();
script.enablePlugin ( pluginClick ) // enable a plugin for mouse clicks
script.enablePlugin ( pluginKey ) // enable a plugin for keyboard shortcuts
```


