export declare const RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
export declare const SHAPE_TREE_PREFIX_IRI = "http://www.w3.org/ns/shapetrees#";
export declare const SOLID_IRI = "http://www.w3.org/ns/solid/terms#";
export declare const SHAPE_TREE_FILE_NAME = "shapetree.ttl";
/**
 * The path of the shape in a pod and the path of the content related to the shape it can be a file or a directory
 */
export interface ShapeContentPath {
    shape: string;
    content: string;
}
export interface Config {
    pods_folder: string;
    shape_folders?: string;
    generate_shape: (path: string, shape_folder: string | undefined) => string | ShapeDontExistError;
    generate_shape_trees: (shapes: Array<ShapeContentPath>, pod_path: string) => void;
}
export declare class ShapeDontExistError extends Error {
    constructor(message: string);
}
