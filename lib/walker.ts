import { join } from "path";
import { readdirSync, copyFileSync } from "fs";
import { getShapeFromPath, ShapeDontExistError } from './shapeUtil';
import { Config } from './parameters';

const SOLID_PODS_RELATIVE_PATHS = "http/localhost_3000/pods";

export async function walkSolidPods(config: Config) {
    const path = getPodRootPath(config.solid_bench_start_fragments_folder);
    const pods_files = readdirSync(path);
    const explore_pods_promises = [];
    for (const pod_path of pods_files) {
        explore_pods_promises.push(
            new Promise(() => {
                explorePod(join(path, pod_path));
            })
        );
    }
    await Promise.all(explore_pods_promises);
}

export function explorePod(pod_path: string) {
    const pod_contents = readdirSync(pod_path);
    const error_array: ShapeDontExistError[] = [];
    const file_generation_promises = [];
    for (const pod_content_path of pod_contents) {
        const shape_path = getShapeFromPath(join(pod_path, pod_content_path));
        if (shape_path instanceof ShapeDontExistError) {
            error_array.push(shape_path);
        } else {
            file_generation_promises.push(new Promise(() => {
                generateShape(shape_path, pod_path)
            }));
        }
    }
    Promise.all(file_generation_promises);
}

function generateShape(shape_path: string, pod_path: string) {
    copyFileSync(shape_path, pod_path);
}

function getPodRootPath(solid_bench_start_fragments_folder: string) {
    return join(solid_bench_start_fragments_folder, SOLID_PODS_RELATIVE_PATHS);
}