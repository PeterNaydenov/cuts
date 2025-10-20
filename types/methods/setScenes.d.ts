export default setScenes;
export type SceneObject = {
    /**
     * - load interface and prerequisites for the scene;
     */
    show: Function;
    /**
     * - run after scene is loaded. Optional. Returns true to continue loading, false to cancel;
     */
    afterShow?: () => boolean;
    /**
     * - Reverse the settings from 'show';
     */
    hide: () => void;
    /**
     * - Run before scene is hidden. Optional;
     */
    beforeHide?: () => void;
    /**
     * - list of parent scene names.
     */
    parents?: Array<string>;
    /**
     * - shortcut descriptions
     */
    "": any;
};
export type sceneDescription = {
    /**
     * - name of the scene
     */
    name: string;
    /**
     * - object should contain 'show' and 'hide' + shortcuts and action functions
     */
    scene: SceneObject;
};
/**
 * @typedef {Object} SceneObject
 * @property {function} show - load interface and prerequisites for the scene;
 * @property {function():boolean} [afterShow] - run after scene is loaded. Optional. Returns true to continue loading, false to cancel;
 * @property {function():void} hide - Reverse the settings from 'show';
 * @property {function():void} [beforeHide] - Run before scene is hidden. Optional;
 * @property {Array.<string>} [parents] - list of parent scene names.
 * @property {*} ... - shortcut descriptions
 */
/**
 * @typedef {Object} sceneDescription
 * @property {string} name - name of the scene
 * @property {SceneObject} scene - object should contain 'show' and 'hide' + shortcuts and action functions
 */
declare function setScenes(dependencies: any, state: any): (list: sceneDescription[]) => void;
//# sourceMappingURL=setScenes.d.ts.map