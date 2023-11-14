import { join } from "path";
import { readdir } from "fs/promises";
const SOLID_PODS_RELATIVE_PATHS = "http/localhost_3000/pods";

export async function walkSolidPods(solid_bench_start_fragments_folder: string) {
    const path = getPodRootPath(solid_bench_start_fragments_folder);
    const pods_files = await readdir(path);
    for (const dir_entry of pods_files) {
        explorePod(join(path, dir_entry));
    }
}

async function explorePod(pod_path: string) {
    const pod_contents = await readdir(pod_path);
    for (const dir_entry of pod_contents) {
        console.log(dir_entry);
    }
}

function getPodRootPath(solid_bench_start_fragments_folder: string) {
    return join(solid_bench_start_fragments_folder, SOLID_PODS_RELATIVE_PATHS);
}