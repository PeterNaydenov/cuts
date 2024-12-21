export default setScenes;
export type SceneObject = any;
export type sceneDescription = any;
/**
 * @typedef {Object} SceneObject
 * @param {function} show - load interface and prerequisites for the scene;
 * @param {function} [afterShow] - run after scene is loaded. Optional;
 * @param {function} hide - Reverse the settings from 'show';
 * @param {function} [beforeHide] - Run before scene is hidden. Optional;
 * @param {Array.<string>} [parents] - list of parent scene names.
 * @param {*} ... - shortcut descriptions
 */
/**
 * @typedef {Object} sceneDescription
 * @param {string} name - name of the scene
 * @param {SceneObject} scene - object should contain 'show' and 'hide' + shortcuts and action functions
 */
declare function setScenes(dependencies: any, state: any): (list: SceneDescription[]) => void;
//# sourceMappingURL=setScenes.d.ts.map