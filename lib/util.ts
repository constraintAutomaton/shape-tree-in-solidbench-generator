export const RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
export const SHAPE_TREE_PREFIX_IRI = "http://www.w3.org/ns/shapetrees#";
export const SOLID_IRI = "http://www.w3.org/ns/solid/terms#";
export const SHAPE_TREE_FILE_NAME = "shapetree.ttl";

export interface ShapeContentPath {
    shape: string,
    content: string
}

export interface Config {
    pod_folder: string,
    generate_shape: (path: string) => string | ShapeDontExistError,
    generate_shape_trees: (shapes: Array<ShapeContentPath>, pod_path: string) => undefined | ShapeTreesCannotBeGenerated
}


export class ShapeTreesCannotBeGenerated extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ShapeTreesCannotBeGenerated";
    }
}


export class ShapeDontExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ShapeDontExistError";
    }
}
