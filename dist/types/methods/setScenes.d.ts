export type AskObject = {
    /**
     * - Mark the task as done
     */
    done: Function;
};
export type SceneObject = {
    /**
     * ({task: AskObject, dependencies: *}): void} show - load interface and prerequisites for the scene;
     */
    : Function;
    /**
     * ({dependencies: *, done: function}):void} [afterShow] - run after the scene is shown. Optional. Fire-and-forget - its return value is not used, and it cannot cancel or affect the already-completed 'show';
     */
    : Function;
    /**
     * ({task: AskObject, dependencies: *}): void} hide - Reverse the settings from 'show';
     */
    : Function;
    /**
     * ():void} [beforeHide] - Run before scene is hidden. Optional;
     */
    : Function;
    /**
     * - list of parent scene names.
     */
    parents?: Array<string>;
    /**
     * - shortcut descriptions
     */
    : any;
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
 * @typedef {Object} AskObject
 * @property {function} done - Mark the task as done
 */
/**
 * @typedef {Object} SceneObject
 * @property {function({task: AskObject, dependencies: *}): void} show - load interface and prerequisites for the scene;
 * @property {function({dependencies: *, done: function}):void} [afterShow] - run after the scene is shown. Optional. Fire-and-forget - its return value is not used, and it cannot cancel or affect the already-completed 'show';
 * @property {function({task: AskObject, dependencies: *}): void} hide - Reverse the settings from 'show';
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
export default setScenes;
//# sourceMappingURL=setScenes.d.ts.map