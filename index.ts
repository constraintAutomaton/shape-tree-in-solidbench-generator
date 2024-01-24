/** 
export * from "./lib/walker";
export type * from "./lib/util";
export * from "./lib/shapeTreesUtil";
export * from "./lib/shapeUtil"

import * as STG from 'shape-tree-in-solid-bench';
*/

import { generateShapeTreesFile } from "./lib/shapeTreesUtil";
import { getShapeFromPath } from "./lib/shapeUtil";
import { Config } from "./lib/util";
import { walkSolidPods } from "./lib/walker";

const config: Config = {
    pods_folder: "out-fragments copy/http/localhost_3000/pods",
    generate_shape: getShapeFromPath,
    generate_shape_trees: generateShapeTreesFile,
};
walkSolidPods(config);