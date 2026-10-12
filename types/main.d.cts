// =============================================================================
//  Cuts - CommonJS type entry
// =============================================================================
//  `require('@peter.naydenov/cuts')` returns the factory function itself
//  (`module.exports = cuts`), so this entry uses `export =`. All types come
//  from `main.d.ts` - add new public types there and re-export them here.
// =============================================================================

type Types = typeof import('./main.js', { with: { 'resolution-mode': 'import' } })
type T<K extends keyof Esm> = Esm[K]
interface Esm {
    LogLevel               : import('./main.js', { with: { 'resolution-mode': 'import' } }).LogLevel
    CutsConfig             : import('./main.js', { with: { 'resolution-mode': 'import' } }).CutsConfig
    AskObject              : import('./main.js', { with: { 'resolution-mode': 'import' } }).AskObject
    Dependencies           : import('./main.js', { with: { 'resolution-mode': 'import' } }).Dependencies
    ShowContext            : import('./main.js', { with: { 'resolution-mode': 'import' } }).ShowContext
    HideContext            : import('./main.js', { with: { 'resolution-mode': 'import' } }).HideContext
    AfterShowContext       : import('./main.js', { with: { 'resolution-mode': 'import' } }).AfterShowContext
    BeforeHideContext      : import('./main.js', { with: { 'resolution-mode': 'import' } }).BeforeHideContext
    ShortcutHandlerContext : import('./main.js', { with: { 'resolution-mode': 'import' } }).ShortcutHandlerContext
    SceneObject            : import('./main.js', { with: { 'resolution-mode': 'import' } }).SceneObject
    SceneDescription       : import('./main.js', { with: { 'resolution-mode': 'import' } }).SceneDescription
    CutsState              : import('./main.js', { with: { 'resolution-mode': 'import' } }).CutsState
    PluginName             : import('./main.js', { with: { 'resolution-mode': 'import' } }).PluginName
    PluginHandle           : import('./main.js', { with: { 'resolution-mode': 'import' } }).PluginHandle
    CutsAPI                : import('./main.js', { with: { 'resolution-mode': 'import' } }).CutsAPI
}

declare const cuts: Types['default']

declare namespace cuts {
    export type LogLevel               = T<'LogLevel'>
    export type CutsConfig             = T<'CutsConfig'>
    export type AskObject              = T<'AskObject'>
    export type Dependencies           = T<'Dependencies'>
    export type ShowContext            = T<'ShowContext'>
    export type HideContext            = T<'HideContext'>
    export type AfterShowContext       = T<'AfterShowContext'>
    export type BeforeHideContext      = T<'BeforeHideContext'>
    export type ShortcutHandlerContext = T<'ShortcutHandlerContext'>
    export type SceneObject            = T<'SceneObject'>
    export type SceneDescription       = T<'SceneDescription'>
    export type CutsState              = T<'CutsState'>
    export type PluginName             = T<'PluginName'>
    export type PluginHandle           = T<'PluginHandle'>
    export type CutsAPI                = T<'CutsAPI'>
}

export = cuts
