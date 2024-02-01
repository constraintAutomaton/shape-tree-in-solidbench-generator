import { join, basename, dirname } from "path";
import { readdirSync, copyFileSync, lstatSync } from "fs";
import { ShapeContentPath, Config, ShapeDontExistError } from './util';
import { generateShapeTreesFile } from "./shapeTreesUtil";
import { generateShapeFromPath } from "./shapeUtil";

/**
 * Walk every pod of a directory
 * @param {Config} config - The parameters for the generation of the shape and shape tree
 * @returns {Promise<Array<Array<Error>> | undefined>} The errors while the generation or undefined if there was no error
 */
export async function walkSolidPods(config: Config): Promise<Array<Array<Error>> | undefined> {
    const pods_files = readdirSync(config.pods_folder);
    const errors: Array<Array<Error>> = [];
    const explore_pods_promises = [];

    for (const pod_path of pods_files) {
        explore_pods_promises.push(
            new Promise((resolve, reject) => {
                const temp = join(config.pods_folder, pod_path)
                const resp = addShapeDataInPod(
                    {
                        pod_path: temp,
                        shape_folder: config.shape_folders
                    }
                );

                if (resp === undefined) {
                    resolve(undefined)
                }

                reject(resp)
            })
        );
    }
    const results = await Promise.allSettled(explore_pods_promises);
    results.forEach((result) => {
        if (result.status === "rejected") {
            errors.push(result.reason);
        }
    });
    if (errors.length === 0) {
        return undefined
    }
    return errors;
}

/**
 * Add the shape and shape tree inside the pods 
 * @returns {undefined | Array<Error>} The errors or undefined if the was no error
 */
export function addShapeDataInPod(
    {
        pod_path,
        shape_folder,
    }
        : {
            pod_path: string,
            shape_folder?: string
        })

    : undefined | Array<Error> {

    const pod_contents = readdirSync(pod_path);
    const error_array: ShapeDontExistError[] = [];
    const file_generation_promises = [];
    // shape path and content path
    const shapes_generated: Array<ShapeContentPath> = [];


    for (const pod_content_path of pod_contents) {
        const content_path = join(pod_path, pod_content_path);
        const shape_path = generateShapeFromPath(content_path, shape_folder);
        if (shape_path instanceof ShapeDontExistError) {
            error_array.push(shape_path);
        } else {

            file_generation_promises.push(new Promise(() => {
                let resulting_shape_path: string;
                if (lstatSync(content_path).isDirectory()) {
                    resulting_shape_path = join(content_path, basename(shape_path));
                } else {
                    resulting_shape_path = join(dirname(content_path), basename(shape_path));
                }
                copyFileSync(shape_path, resulting_shape_path);

                shapes_generated.push({ shape: resulting_shape_path, content: content_path });
            }));
        }

    }

    Promise.all(file_generation_promises);
    generateShapeTreesFile(shapes_generated, pod_path);


    if (error_array.length !== 0) {
        return error_array
    }

}


