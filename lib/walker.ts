import { join } from "https://deno.land/std@0.202.0/path/mod.ts";

const SOLID_PODS_RELATIVE_PATHS = "http/localhost_3000/pods";

export async function walkSolidPods(solid_bench_start_fragments_folder: string) {
    const path = getPodRootPath(solid_bench_start_fragments_folder);
    for await (const dir_entry of Deno.readDir(path)) {
        explorePod(join(path, dir_entry.name));
    }
}

async function explorePod(pod_path: string) {
    for await (const dir_entry of Deno.readDir(pod_path)) {
        console.log(dir_entry);
    }
}

function getPodRootPath(solid_bench_start_fragments_folder: string) {
    return join(solid_bench_start_fragments_folder, SOLID_PODS_RELATIVE_PATHS);
}