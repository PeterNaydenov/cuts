// =============================================================================
//  Cuts - public type surface
// =============================================================================
//  This file is hand-written and is the source of truth for the public API
//  shape. The postbuild step (`tsc -p tsconfig.json`) emits auto-generated
//  internal type artefacts to `dist/types/` so that this file is not
//  overwritten on every build.
// =============================================================================


// -----------------------------------------------------------------------------
//  Configuration
// -----------------------------------------------------------------------------

/**
 * Log level for the cuts runtime.
 *
 * - `0` — silent. No errors are logged and no `@app-error` events are emitted.
 * - `1` (default) — errors are logged and re-emitted as `@app-error` events.
 *
 * Cuts only ever logs at level `1` internally, so any other numeric value
 * behaves like `0`.
 */
export type LogLevel = 0 | 1

/**
 * Options accepted by the `cuts()` factory.
 */
export interface CutsConfig {
    logLevel?: LogLevel
}


// -----------------------------------------------------------------------------
//  Scene lifecycle
// -----------------------------------------------------------------------------

/**
 * A `task` object handed to `show` and `hide` lifecycle functions.
 * Call `task.done()` (optionally with a value) to signal that the scene
 * has finished its work and cuts can move on.
 */
export interface AskObject {
    done: (result?: any) => void
}

/**
 * Bag of values merged into the dependencies passed to every scene
 * lifecycle function and shortcut handler. Always includes a built-in
 * `emit` function (added in v2.1.0) that can fire shortcut or event
 * names from inside a handler.
 */
export type Dependencies = Record<string, any>

/**
 * Context received by a scene's `show` function.
 */
export interface ShowContext {
    task: AskObject
    dependencies: Dependencies
}

/**
 * Context received by a scene's `hide` function.
 */
export interface HideContext {
    task: AskObject
    dependencies: Dependencies
}

/**
 * Context received by a scene's optional `afterShow` function.
 *
 * `afterShow` is **fire-and-forget** — its return value is ignored, and
 * the provided `done` callback is a no-op. The scene is already shown
 * by the time this runs; use it for deferred work that should not
 * block the show pipeline (analytics, lazy data, animations).
 */
export interface AfterShowContext {
    dependencies: Dependencies
    done: () => void
}

/**
 * Context received by a scene's optional `beforeHide` function.
 *
 * Call `done(true)` to allow the hide, or `done(false)` to cancel it.
 * The current navigation is aborted if `done(false)` is called.
 */
export interface BeforeHideContext {
    dependencies: Dependencies
    done: (continueHiding: boolean) => void
}

/**
 * Context received by a shortcut handler. Shape varies slightly by
 * plugin, but the common fields are present on all of them.
 */
export interface ShortcutHandlerContext {
    target?: any
    event?: any
    dependencies: Dependencies
}

/**
 * A scene is the data model that describes one visual state of the app:
 * how to render it, how to tear it down, what scenes must be open first,
 * and which user inputs it responds to.
 */
export interface SceneObject {
    /** Required. Render the scene. Call `task.done()` when finished. */
    show: (context: ShowContext) => void | Promise<void>
    /** Required. Tear the scene down. Call `task.done()` when finished. */
    hide: (context: HideContext) => void | Promise<void>
    /**
     * Optional. Runs after the scene is fully shown.
     * Fire-and-forget — return value is ignored, `done` is a no-op.
     */
    afterShow?: (context: AfterShowContext) => void
    /**
     * Optional. Runs before the scene is hidden.
     * Call `done(false)` to block the hide.
     */
    beforeHide?: (context: BeforeHideContext) => void
    /**
     * Optional. Path of scene names that must be open before this one.
     * Use `['*']` for an overlay (modal, toast, drawer) that sits on
     * top of whatever scene is currently active.
     */
    parents?: string[]
    /**
     * Shortcut handlers keyed by shortcut name. Names are free-form
     * strings today; the conventional shape is `<plugin>: <event>`,
     * e.g. `click: left-1`, `key: ctrl+s`, `form: submit`,
     * `hover: enter`, `scroll: down`. See the "Shortcut plugins"
     * section in the README for the full list.
     */
    [shortcut: string]: any
}

/**
 * A scene description as accepted by `setScenes`.
 */
export interface SceneDescription {
    /** Name of the scene. */
    name: string
    /** The scene object itself. */
    scene: SceneObject
}


// -----------------------------------------------------------------------------
//  Public state shape
// -----------------------------------------------------------------------------

/**
 * Snapshot of the cuts runtime state. Returned by `getState()`.
 * The `parents` array is a fresh copy and is safe to mutate.
 */
export interface CutsState {
    /** Name of the currently-active scene, or `null` if nothing is active. */
    scene: string | null
    /**
     * Snapshot of the parent chain (top-of-stack last). `null` when the
     * scene manager has not yet been opened (before the first `show()`).
     */
    parents: string[] | null
    /** `false` until the first `show()` call lands. */
    opened: boolean
}


// -----------------------------------------------------------------------------
//  Plugins
// -----------------------------------------------------------------------------

/**
 * Names of shortcut plugins bundled with `@peter.naydenov/shortcuts`.
 * Pass any of these to `loadPlugins` to obtain a plugin handle.
 */
export type PluginName = 'Key' | 'Click' | 'Form' | 'Hover' | 'Scroll'

/**
 * A loaded plugin handle. Returned by `loadPlugins` and passed back
 * into `enablePlugin`.
 */
export type PluginHandle = Function


// -----------------------------------------------------------------------------
//  Public API
// -----------------------------------------------------------------------------

/**
 * The shape returned by the `cuts()` factory.
 */
export interface CutsAPI {
    /**
     * Activate a scene. Walks the parent chain: opens any missing
     * parents, then opens the target. Closes any scenes that are no
     * longer on the path. The current scene's `beforeHide` can block
     * the navigation by calling `done(false)`.
     */
    show(
        request: { scene: string; options?: { ssr?: boolean } },
        ...args: any[]
    ): Promise<any>

    /**
     * Deactivate the current scene. Default closes 1 step (the current
     * scene only). Pass a number to close more steps, or `'*'` to
     * close everything back to the root.
     */
    hide(endSteps?: number | string): Promise<void>

    /**
     * Navigate to a scene and remember the current one on the jump
     * stack. Only pushes onto the stack if the navigation actually
     * lands (didn't get blocked by `beforeHide` or fail).
     */
    jump(request: { scene: string }, ...args: any[]): Promise<any>

    /**
     * Return from a `jump`. Default returns 1 level. Pass `{ hops: N }`
     * to skip multiple levels. Returns `undefined` if the stack is
     * empty (a no-op).
     */
    jumpBack(options?: { hops?: number }, ...args: any[]): Promise<any> | undefined

    /**
     * Clear the jump stack. All previous jump positions are forgotten.
     */
    jumpsReset(): void

    /**
     * Register scenes. Each item is `{ name, scene }`. Errors are
     * logged but do not throw.
     */
    setScenes(list: SceneDescription[]): void

    /** Return the names of all registered scenes. */
    listScenes(): string[]

    /**
     * Return the shortcut keys defined on a scene, or `null` if the
     * scene is unknown. Lifecycle methods (`show`, `hide`, `afterShow`,
     * `beforeHide`) and `parents` are excluded.
     */
    listShortcuts(sceneName: string): string[] | null

    /**
     * Merge values into the dependencies bag. The bag is also exposed
     * (with a built-in `emit` function) inside every handler and
     * scene lifecycle function.
     */
    setDependencies(deps: Record<string, any>): void

    /** Return the current dependencies bag. */
    getDependencies(): Record<string, any>

    /**
     * Set a string passed to action functions alongside the
     * dependencies. Useful for sharing contextual data without
     * restructuring the dependencies bag.
     */
    setNote(note: string): void

    /**
     * Load shortcut plugins by name. Returns the plugin handles to
     * pass into `enablePlugin`. Async (uses dynamic `import()`).
     */
    loadPlugins(plugins: PluginName[]): Promise<PluginHandle[]>

    /**
     * Activate a loaded plugin. The plugin handle is what
     * `loadPlugins` returns.
     */
    enablePlugin(plugin: PluginHandle, options?: Record<string, any>): void

    /**
     * Deactivate a loaded plugin. **Takes the plugin name (string),
     * not the handle** — inverse operation of `enablePlugin` with a
     * different signature.
     */
    disablePlugin(pluginName: PluginName): void

    /**
     * Return a snapshot of the current state. The returned `parents`
     * array is a copy and is safe to mutate.
     */
    getState(): CutsState

    /**
     * Fire an event by name. Handlers registered on the current
     * scene under the same name will be called with the supplied
     * arguments. The same `emit` function is also available as
     * `dependencies.emit` inside any handler.
     */
    emit(event: string, ...args: any[]): void
}


/**
 * Create a cuts scene manager.
 *
 * @example
 * ```ts
 * import cuts from '@peter.naydenov/cuts'
 *
 * const script = cuts({ logLevel: 1 })
 * script.setScenes([
 *   {
 *     name: 'home',
 *     scene: {
 *       show: ({ task }) => { task.done() },
 *       hide: ({ task }) => { task.done() },
 *     },
 *   },
 * ])
 * await script.show({ scene: 'home' })
 * ```
 */
declare function cuts(cfg?: CutsConfig): CutsAPI

export default cuts
