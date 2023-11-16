import { join } from "path";
import { readdirSync } from "fs";
import { getShapeFromPath, ShapeDontExistError } from './shapeUtil';

const SOLID_PODS_RELATIVE_PATHS = "http/localhost_3000/pods";

export async function walkSolidPods(solid_bench_start_fragments_folder: string) {
    const path = getPodRootPath(solid_bench_start_fragments_folder);
    const pods_files = readdirSync(path);
    const explore_pods_promises = [];
    for (const dir_entry of pods_files) {
        explore_pods_promises.push(
            new Promise(() => {
                explorePod(join(path, dir_entry));
            })
        );
    }
    await Promise.all(explore_pods_promises);
}

function explorePod(pod_path: string) {
    const pod_contents = readdirSync(pod_path);
    for (const dir_entry of pod_contents) {
        const shape_path = getShapeFromPath(join(pod_path, dir_entry));
        if (!(shape_path instanceof ShapeDontExistError)) {
            console.log(`the shape path is ${shape_path} for the dir ${dir_entry}`)
        }
    }
}

function getPodRootPath(solid_bench_start_fragments_folder: string) {
    return join(solid_bench_start_fragments_folder, SOLID_PODS_RELATIVE_PATHS);
}