import { walkSolidPods } from "./lib/walker";
import type { Config } from "./lib/util";
import { generateShapeTrees } from "./lib/shapeTreesUtil";
import { getShapeFromPath } from "./lib/shapeUtil"

const config: Config = {
    pod_folder: "out-fragments copy/http/localhost_3000/pods",
    generate_shape: getShapeFromPath,
    generate_shape_trees: generateShapeTrees,
};
walkSolidPods(config)