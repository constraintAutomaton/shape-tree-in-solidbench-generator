import { parse, join } from "path";
import { ShapeDontExistError } from "./util";
import { readFileSync } from 'fs';
const SHAPE_FOLDER_DEFAULT = "./shapes";

/**
 * A map of the type of information in the pod with the path of the shape
 * @constant {Map<string, string>}
 */
let SHAPE_MAP: Map<string, string> = new Map([
    ['posts', `posts.shexc`],
]);

/**
 * Get the shape related to the data of the pod
 * @param {string} path - The path of a pod data
 * @returns {string | ShapeDontExistError} The template path file or an error if the pod data is not supported
 */
export function generateShapeFromPath(path: string, shapes_folder: string = SHAPE_FOLDER_DEFAULT): string | ShapeDontExistError {
    const path_serialized = parse(path);
    const shape_file_path = SHAPE_MAP.get(path_serialized.name);
    if (shape_file_path === undefined) {
        return new ShapeDontExistError(`The shape derived from the file ${path_serialized.name} don't exist `);
    }
    return join(shapes_folder, shape_file_path);
}

export function generateShapeMap(path: string = SHAPE_FOLDER_DEFAULT) {
    const config = JSON.parse(readFileSync(join(path, 'config.json')).toString());
    const shapes = config["shapes"];
    SHAPE_MAP.clear();
    for (const [dataType, shape] of Object.entries(shapes)) {
        SHAPE_MAP.set(dataType, <string>shape);
    }
}

export function getShapeMap(): Map<string, string>{
    return new Map(SHAPE_MAP)
}