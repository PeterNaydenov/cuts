declare function main(cfg?: {
    logLevel: number;
}): {
    hide: (endSteps?: number | string) => Promise<any>;
    listShortcuts: (sceneName: string) => (Array<string> | null);
    setScenes: (list: import("./methods/setScenes.js").sceneDescription[]) => void;
    show: ({ scene: requestedScene, options }: {
        scene: string;
        options?: {
            ssr: boolean;
        };
    }, ...args?: any[]) => Promise<any>;
    jump: ({ scene }: {
        scene: string;
    }, ...args?: any[]) => Promise<any>;
    jumpBack: ({ hops }?: {
        hops?: number;
    }, ...args?: any[]) => Promise<any> | undefined;
    jumpsReset: () => void;
    /**
     * @typedef {'Key'|'Click'|'Form'|'Hover'|'Scroll' } pluginNames
     * @description List of possible plugin names: 'Key', 'Click', 'Form', 'Hover', 'Scroll'
     *
     * Load a needed shortcut plugins - 'Key', 'Click', 'Form', 'Hover', 'Scroll' and so on.
     * It's a async function. Don't forget to 'await' it.
     * @function loadPlugins
     * @param {Array.<pluginNames>} plugins - list of plugins to load
     * @returns {Promise.<function[]>} - loaded plugins in a sequence
     *
     * @example
     * // script is instance of cuts
     * await script.loadPlugins ( ['Key', 'Click'] )
     *             .then ( plugins => plugins.forEach ( plugin => script.enablePlugin ( plugin ) ) )
     */
    loadPlugins: (plugins: Array<"Click" | "Form" | "Hover" | "Key" | "Scroll">) => Promise<Function[]>;
    /**
     * @function setDependencies
     * @description Set dependencies for the Scenes
     * @param {*} deps - dependencies objects
     * @returns void
     */
    setDependencies: (deps: any) => void;
    /**
     * @function getDependencies
     * @description Get dependencies for the Scenes
     * @returns {*} - dependencies objects
     */
    getDependencies: () => any;
    /**
     * @function setNote
     * @param {string} note - note, provided to action functions
     * @returns void
     */
    setNote: (note: string) => void;
    /**
     * @function listScenes
     * @description List all loaded Scene names
     * @returns {Array.<string>} - list of scene names
     */
    listScenes: () => Array<string>;
    /**
     * @function enablePlugin
     * @description Enable a shortcut plugin
     * @param {function} plugin - plugin library
     * @param {*} [options] - plugin options
     * @returns void
     */
    enablePlugin: (plugin: Function, options?: any) => void;
    /**
     * Disable a shortcut plugin
     * @function disablePlugin
     * @param {string} pluginName - plugin name
     * @returns void
     */
    disablePlugin: (pluginName: string) => void;
    /**
     * Get the current state of the application
     * @function getState
     * @returns {Object} with properties:
     *  - scene: current scene name
     *  - parents: current parent scene names
     *  - opened: boolean indicating if the application is opened
     */
    getState: () => Object;
    /**
     * @function emit
     * @description Emit an event
     * @param {string} event - event name
     * @param {...*} args - Extra data to pass to the listeners
     * @returns void
     */
    emit: (event: string, ...args: any[]) => any;
};
export default main;
//# sourceMappingURL=main.d.ts.map