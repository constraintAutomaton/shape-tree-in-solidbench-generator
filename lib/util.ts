export const RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
export const SHAPE_TREE_PREFIX_IRI = "http://www.w3.org/ns/shapetrees#";
export const SOLID_IRI = "http://www.w3.org/ns/solid/terms#";
export const SHAPE_TREE_FILE_NAME = "shapetree.ttl";

/**
 * The path of the shape in a pod and the path of the content related to the shape it can be a file or a directory
 */
export interface ShapeContentPath {
    shape: string,
    content: string
}

export interface Config {
    pods_folder: string,
    shape_folders?: string,
    generate_shape: (path: string, shape_folder: string | undefined) => string | ShapeDontExistError,
    generate_shape_trees: (shapes: Array<ShapeContentPath>, pod_path: string) => void
}

export class ShapeDontExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ShapeDontExistError";
    }
}
