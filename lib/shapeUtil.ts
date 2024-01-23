import { parse, join } from "path";
import { ShapeDontExistError } from "./util";

const SHAPE_PATH = "./shapes";
const SHAPE_EXTENSION = "shexc";

const POST_SHAPE_PATH = join(SHAPE_PATH, `posts.${SHAPE_EXTENSION}`);

/**
 * A map of the type of information in the pod with the path of the shape
 * @constant {Map<string, string>}
 */
export const SHAPE_MAP: Map<string, string> = new Map([
    ['posts', POST_SHAPE_PATH],
]);

/**
 * Get the shape related to the data of the pod
 * @param {string} path - The path of a pod data
 * @returns {string | ShapeDontExistError} The template path file or an error if the pod data is not supported
 */
export function getShapeFromPath(path: string): string | ShapeDontExistError {
    const path_serialized = parse(path);
    const shape_path = SHAPE_MAP.get(path_serialized.name);
    if (shape_path === undefined) {
        return new ShapeDontExistError(`The shape derived from the file ${path_serialized.name} don't exist `)
    }
    return shape_path
}
