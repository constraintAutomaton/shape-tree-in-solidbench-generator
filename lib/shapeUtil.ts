import { parse, join } from "path";
/**
import { Term } from "@rdfjs/types";
import { DataFactory } from 'rdf-data-factory';
import type * as RDF from 'rdf-js';
const DF = new DataFactory<RDF.BaseQuad>();
*/

const SHAPE_PATH = "./shapes";
const SHAPE_EXTENSION = "shexc";

const POST_SHAPE_PATH = join(SHAPE_PATH, `posts.${SHAPE_EXTENSION}`);

const SHAPE_MAP: Map<string, string> = new Map([
    ['posts', POST_SHAPE_PATH],
]);

export function getShapeFromPath(path: string): string | ShapeDontExistError {
    const path_serialized = parse(path);
    const shape_path = SHAPE_MAP.get(path_serialized.name);
    if (shape_path === undefined) {
        return new ShapeDontExistError(`The shape derived from the file ${path_serialized.name} don't exist `)
    }

    return shape_path;
}

export class ShapeDontExistError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ShapeDontExistError";
    }
}