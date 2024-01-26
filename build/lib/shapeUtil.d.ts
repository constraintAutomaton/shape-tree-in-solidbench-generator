import { ShapeDontExistError } from "./util";
/**
 * A map of the type of information in the pod with the path of the shape
 * @constant {Map<string, string>}
 */
export declare const SHAPE_MAP: Map<string, string>;
/**
 * Get the shape related to the data of the pod
 * @param {string} path - The path of a pod data
 * @returns {string | ShapeDontExistError} The template path file or an error if the pod data is not supported
 */
export declare function getShapeFromPath(path: string, shape_folder?: string | undefined): string | ShapeDontExistError;
