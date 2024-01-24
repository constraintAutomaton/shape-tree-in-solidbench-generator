import { v4 as uuidv4 } from 'uuid';
import { Writer } from "n3";
import { join, parse } from "path";
import { lstatSync, appendFileSync } from "fs";
import { DataFactory } from 'rdf-data-factory';
import type * as RDF from 'rdf-js';
import { ShapeContentPath, RDF_TYPE_IRI, SHAPE_TREE_PREFIX_IRI, SOLID_IRI, SHAPE_TREE_FILE_NAME } from './util';

const DF = new DataFactory<RDF.BaseQuad>();

/**
 * generate the shape tree file in the pod named by the variable"SHAPE_TREE_FILE_NAME"
 * @param {Array<ShapeContentPath>} shape_content - path of the shapes and the shape target
 * @param {string} pod_path - path of the pod
 */
export function generateShapeTreesFile(shape_content: Array<ShapeContentPath>, pod_path: string) {
    const writer = new Writer();
    for (const { shape, content } of shape_content) {
        generateTreeAShapeTree(pod_url_path_from_file_path(shape), content, writer);
    }
    writer.end((_error, result) => {
        appendFileSync(join(pod_path, SHAPE_TREE_FILE_NAME), result);
    });
}

/**
 * Generate the triples for a shape tree entry (an entry being a type of information like the post, profile and others)
 * @param {string} shape_path - The path of the shape
 * @param {string} content_path - The path of the targeted content, can be a file or a directory
 * @param {Writer} writer - A writer accumulating the shape tree entries
 */
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
        DF.namedNode(pod_url_path_from_file_path(content_path))
    );
}

function pod_url_path_from_file_path(path: string) {
    const re = /(https?)\/(.*)\/(pods)\/(.*)/;
    const found = path.match(re);
    if (found === null) {
        throw new Error("should be an unix path");
    }
    const [http, name_space, pods, rest_url] = [found[1], found[2], found[3], found[4]];
    return `${http}://${name_space.replace("_",":")}/${pods}/${rest_url}`;
}