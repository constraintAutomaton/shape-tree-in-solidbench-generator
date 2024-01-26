import { ShapeContentPath } from './util';
/**
 * generate the shape tree file in the pod named by the variable"SHAPE_TREE_FILE_NAME"
 * @param {Array<ShapeContentPath>} shape_content - path of the shapes and the shape target
 * @param {string} pod_path - path of the pod
 */
export declare function generateShapeTreesFile(shape_content: Array<ShapeContentPath>, pod_path: string): void;
