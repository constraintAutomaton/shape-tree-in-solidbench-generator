"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShapeFromPath = exports.SHAPE_MAP = void 0;
const path_1 = require("path");
const util_1 = require("./util");
const SHAPE_FOLDER_DEFAULT = "./shapes";
const SHAPE_EXTENSION = "shexc";
/**
 * A map of the type of information in the pod with the path of the shape
 * @constant {Map<string, string>}
 */
exports.SHAPE_MAP = new Map([
    ['posts', `posts.${SHAPE_EXTENSION}`],
]);
/**
 * Get the shape related to the data of the pod
 * @param {string} path - The path of a pod data
 * @returns {string | ShapeDontExistError} The template path file or an error if the pod data is not supported
 */
function getShapeFromPath(path, shape_folder = SHAPE_FOLDER_DEFAULT) {
    const path_serialized = (0, path_1.parse)(path);
    const shape_path = exports.SHAPE_MAP.get(path_serialized.name);
    if (shape_path === undefined) {
        return new util_1.ShapeDontExistError(`The shape derived from the file ${path_serialized.name} don't exist `);
    }
    return (0, path_1.join)(shape_folder === undefined ? SHAPE_FOLDER_DEFAULT : shape_folder, shape_path);
}
exports.getShapeFromPath = getShapeFromPath;
