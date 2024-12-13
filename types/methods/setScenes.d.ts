export default setScenes;
export type sceneDescription = any;
/**
 * @typedef {Object} sceneDescription
 * @param {string} name - name of the scene
 * @param {object} scene - object should contain 'show' and 'hide' + shortcuts and action functions
 */
declare function setScenes(dependencies: any, state: any): (list: ScreenDescription[]) => void;
//# sourceMappingURL=setScenes.d.ts.map