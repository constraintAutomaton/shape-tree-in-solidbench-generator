import { ShapeContentPath, Config, ShapeDontExistError } from './util';
/**
 * Walk every pod of a directory
 * @param {Config} config - The parameters for the generation of the shape and shape tree
 * @returns {Promise<Array<Array<Error>> | undefined>} The errors while the generation or undefined if there was no error
 */
export declare function walkSolidPods(config: Config): Promise<Array<Array<Error>> | undefined>;
/**
 * Add the shape and shape tree inside the pods
 * @returns {undefined | Array<Error>} The errors or undefined if the was no error
 */
export declare function addShapeDataInPod({ pod_path, generate_shape, generate_shape_trees, shape_folder, }: {
    pod_path: string;
    generate_shape?: (path: string, shape_folder: string | undefined) => string | ShapeDontExistError;
    generate_shape_trees?: (shapes: Array<ShapeContentPath>, pod_path: string) => void;
    shape_folder?: string;
}): undefined | Array<Error>;
