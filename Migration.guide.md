# Migration Guides

## From version 1.x.x to version 2.x.x

Cuts v2.0.0 upgrades to `@peter.naydenov/shortcuts` version 4.x.x. This introduces breaking changes in how click and hover target attributes are configured, and adds new 'Hover' and 'Scroll' plugins.

### Plugin Target Attributes Changes

**Breaking Changes:**
- Plugin `click` parameter `clickTarget` now accepts an **array of attribute names** instead of a single string
- Plugin `hover` parameter `hoverTarget` now accepts an **array of attribute names** instead of a single string

**Migration Required:**

```js
// Version 1.x.x (old)
script.enablePlugin(pluginClick, { clickTarget: 'data-button' })
script.enablePlugin(pluginHover, { hoverTarget: 'data-menu' })

// Version 2.x.x (new)
script.enablePlugin(pluginClick, { clickTarget: ['data-button'] })
script.enablePlugin(pluginHover, { hoverTarget: ['data-menu'] })
```

**Default Values Updated:**
- `clickTarget` default: `['data-click', 'href']` (was `'data-click'`)
- `hoverTarget` default: `['data-hover']` (was `'data-hover'`)

**Benefits:**
- More flexible target detection
- Support for multiple attribute patterns
- Better compatibility with existing HTML patterns

### Per-Context Setup Examples Updated

All setup examples in the documentation have been updated to use arrays:

```js
// Version 2.x.x per-context setup
const shortcutDefinition = {
    myContext: {
        'click:setup': () => ({
            clickTarget: ['data-action', 'data-button', 'href'] // Array format
        }),
        'hover:setup': () => ({
            hoverTarget: ['data-interactive', 'data-hover'] // Array format
        })
    }
};
```

### Package Dependencies Update

Update your `package.json`:

```json
{
  "dependencies": {
    "@peter.naydenov/cuts": "^2.0.0",
    "@peter.naydenov/shortcuts": "^4.0.0"
  }
}
```

### Backward Compatibility

No other breaking changes were introduced. All existing cuts API methods remain the same:
- `script.show()`
- `script.hide()`
- `script.jump()`
- `script.jumpBack()`
- `script.setScenes()`
- `script.listShortcuts()`
- etc.

### Example Migration

**Before (v1.x.x):**
```js
import cuts from '@peter.naydenov/cuts'

const script = cuts()
await script.loadPlugins(['Click'])
script.enablePlugin(pluginClick, { clickTarget: 'data-action' })
```

**After (v2.x.x):**
```js
import cuts from '@peter.naydenov/cuts'

const script = cuts()
await script.loadPlugins(['Click'])
script.enablePlugin(pluginClick, { clickTarget: ['data-action'] })
```
