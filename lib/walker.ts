import { join, parse } from "path";
import { readdirSync, copyFileSync, lstatSync, appendFileSync } from "fs";
import { getShapeFromPath } from './shapeUtil';
import { generateShapeTrees } from './shapeTreesUtil'
import { ShapeContentPath, Config, ShapeTreesCannotBeGenerated, ShapeDontExistError } from './util';


export async function walkSolidPods(config: Config): Promise<Array<Array<Error>> | undefined> {
    const pods_files = readdirSync(config.pod_folder);
    const errors: Array<Array<Error>> = [];
    const explore_pods_promises = [];
    for (const pod_path of pods_files) {
        explore_pods_promises.push(
            new Promise((resolve, reject) => {
                const resp = addShapeDataInPod(
                    {
                        pod_path: join(config.pod_folder, pod_path),
                        generate_shape: config.generate_shape,
                        generate_shape_trees: config.generate_shape_trees
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

export function addShapeDataInPod(
    {
        pod_path,
        generate_shape,
        generate_shape_trees: generate_shape_trees
    }
        : {
            pod_path: string,
            generate_shape?: (path: string) => string | ShapeDontExistError,
            generate_shape_trees?: (shapes: Array<ShapeContentPath>, pod_path: string) => undefined | ShapeTreesCannotBeGenerated
        })

    : undefined | Array<Error> {
    if (generate_shape === undefined && generate_shape_trees === undefined) {
        return undefined;
    }
    const pod_contents = readdirSync(pod_path);
    const error_array: ShapeDontExistError[] = [];
    const file_generation_promises = [];
    // shape path and content path
    const shapes_generated: Array<ShapeContentPath> = [];


    for (const pod_content_path of pod_contents) {
        if (generate_shape !== undefined) {
            const content_path = join(pod_path, pod_content_path);
            const shape_path = generate_shape(content_path);
            if (shape_path instanceof ShapeDontExistError) {
                error_array.push(shape_path);
            } else {
                shapes_generated.push({ shape: shape_path, content: content_path });
                file_generation_promises.push(new Promise(() => {
                    copyFileSync(shape_path, pod_path);
                }));
            }
        }
    }

    Promise.all(file_generation_promises);

    if (generate_shape_trees !== undefined) {
        const shape_trees_error = generate_shape_trees(shapes_generated, pod_path);
        if (shape_trees_error !== undefined) {
            error_array.push(shape_trees_error)
            return error_array
        } else if (error_array.length !== 0) {
            return error_array
        }
    } else if (error_array.length !== 0) {
        return error_array
    }

}


