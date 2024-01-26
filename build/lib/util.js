export const RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
export const SHAPE_TREE_PREFIX_IRI = "http://www.w3.org/ns/shapetrees#";
export const SOLID_IRI = "http://www.w3.org/ns/solid/terms#";
export const SHAPE_TREE_FILE_NAME = "shapetree.ttl";
export class ShapeDontExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "ShapeDontExistError";
    }
}
