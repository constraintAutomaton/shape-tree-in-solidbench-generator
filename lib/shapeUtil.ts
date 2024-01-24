import { parse, join } from "path";
import { ShapeDontExistError } from "./util";

const SHAPE_FOLDER_DEFAULT = "./shapes";
const SHAPE_EXTENSION = "shexc";

/**
 * A map of the type of information in the pod with the path of the shape
 * @constant {Map<string, string>}
 */
export const SHAPE_MAP: Map<string, string> = new Map([
    ['posts', `posts.${SHAPE_EXTENSION}`],
]);

/**
 * Get the shape related to the data of the pod
 * @param {string} path - The path of a pod data
 * @returns {string | ShapeDontExistError} The template path file or an error if the pod data is not supported
 */
export function getShapeFromPath(path: string, shape_folder: string | undefined = SHAPE_FOLDER_DEFAULT): string | ShapeDontExistError {
    const path_serialized = parse(path);
    const shape_path = SHAPE_MAP.get(path_serialized.name);
    if (shape_path === undefined) {
        return new ShapeDontExistError(`The shape derived from the file ${path_serialized.name} don't exist `);
    }
    return join(shape_folder === undefined ? SHAPE_FOLDER_DEFAULT : shape_folder, shape_path);
}
