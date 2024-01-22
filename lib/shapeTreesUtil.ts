import { v4 as uuidv4 } from 'uuid';
import { Writer } from "n3";
import { join, parse } from "path";
import { lstatSync, appendFileSync } from "fs";
import { DataFactory } from 'rdf-data-factory';
import type * as RDF from 'rdf-js';
import { ShapeContentPath, RDF_TYPE_IRI, SHAPE_TREE_PREFIX_IRI, SOLID_IRI, SHAPE_TREE_FILE_NAME } from './util';
import { ShapeTreesCannotBeGenerated } from "./util";

const DF = new DataFactory<RDF.BaseQuad>();

export function generateShapeTrees(shape_content: Array<ShapeContentPath>, pod_path: string): undefined {
    const writer = new Writer();
    for (const { shape, content } of shape_content) {
        generateTreeAShapeTree(shape, content, writer);
    }
    writer.end((_error, result) => {
        appendFileSync(join(pod_path, SHAPE_TREE_FILE_NAME), result);

    });

}

function generateTreeAShapeTree(shape_path: string, content_path: string, writer: Writer) {
    const label_tree = `${parse(content_path).name}_${uuidv4()}`
    writer.addQuad(
        DF.namedNode(label_tree),
        DF.namedNode(RDF_TYPE_IRI),
        DF.namedNode(`${SHAPE_TREE_PREFIX_IRI}ShapeTree`)
    );

    writer.addQuad(
        DF.namedNode(label_tree),
        DF.namedNode(`${SHAPE_TREE_PREFIX_IRI}expectsType`),
        DF.namedNode(`${SHAPE_TREE_PREFIX_IRI}Resource`),
    );

    writer.addQuad(
        DF.namedNode(label_tree),
        DF.namedNode(`${SHAPE_TREE_PREFIX_IRI}shape`),
        DF.namedNode(shape_path),
    )

    writer.addQuad(
        DF.namedNode(label_tree),
        DF.namedNode(`${SOLID_IRI}${lstatSync(content_path).isDirectory() ? "instanceContainer" : "instance"}`),
        DF.namedNode(content_path)
    );
}
