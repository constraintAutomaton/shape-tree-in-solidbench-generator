"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeDontExistError = exports.SHAPE_TREE_FILE_NAME = exports.SOLID_IRI = exports.SHAPE_TREE_PREFIX_IRI = exports.RDF_TYPE_IRI = void 0;
exports.RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
exports.SHAPE_TREE_PREFIX_IRI = "http://www.w3.org/ns/shapetrees#";
exports.SOLID_IRI = "http://www.w3.org/ns/solid/terms#";
exports.SHAPE_TREE_FILE_NAME = "shapetree.ttl";
class ShapeDontExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "ShapeDontExistError";
    }
}
exports.ShapeDontExistError = ShapeDontExistError;
