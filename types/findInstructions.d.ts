export default findInstructions;
/**
 * @function findInstructions
 * @description Generator that yields instructions for transitioning between scenes
 * @param {string|null} currentName - current scene name
 * @param {Array.<string>|null} currentParents - current scene parents
 * @param {string} targetName - target scene name
 * @param {Array.<string>} targetParents - target scene parents
 * @yields {Array.<string, 'show'|'hide'>} - instruction array with scene name and action
 */
declare function findInstructions(currentName: string | null, currentParents: Array<string> | null, targetName: string, targetParents: Array<string>): Generator<string[], void, unknown>;
//# sourceMappingURL=findInstructions.d.ts.map