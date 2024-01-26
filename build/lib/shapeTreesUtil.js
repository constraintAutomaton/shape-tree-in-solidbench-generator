"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShapeTreesFile = void 0;
const uuid_1 = require("uuid");
const n3_1 = require("n3");
const path_1 = require("path");
const fs_1 = require("fs");
const rdf_data_factory_1 = require("rdf-data-factory");
const util_1 = require("./util");
const DF = new rdf_data_factory_1.DataFactory();
/**
 * generate the shape tree file in the pod named by the variable"SHAPE_TREE_FILE_NAME"
 * @param {Array<ShapeContentPath>} shape_content - path of the shapes and the shape target
 * @param {string} pod_path - path of the pod
 */
function generateShapeTreesFile(shape_content, pod_path) {
    const writer = new n3_1.Writer();
    for (const { shape, content } of shape_content) {
        generateTreeAShapeTree(pod_url_path_from_file_path(shape), content, writer);
    }
    writer.end((_error, result) => {
        (0, fs_1.appendFileSync)((0, path_1.join)(pod_path, util_1.SHAPE_TREE_FILE_NAME), result);
    });
}
exports.generateShapeTreesFile = generateShapeTreesFile;
/**
 * Generate the triples for a shape tree entry (an entry being a type of information like the post, profile and others)
 * @param {string} shape_path - The path of the shape
 * @param {string} content_path - The path of the targeted content, can be a file or a directory
 * @param {Writer} writer - A writer accumulating the shape tree entries
 */
function generateTreeAShapeTree(shape_path, content_path, writer) {
    const label_tree = `${(0, path_1.parse)(content_path).name}_${(0, uuid_1.v4)()}`;
    writer.addQuad(DF.namedNode(label_tree), DF.namedNode(util_1.RDF_TYPE_IRI), DF.namedNode(`${util_1.SHAPE_TREE_PREFIX_IRI}ShapeTree`));
    writer.addQuad(DF.namedNode(label_tree), DF.namedNode(`${util_1.SHAPE_TREE_PREFIX_IRI}expectsType`), DF.namedNode(`${util_1.SHAPE_TREE_PREFIX_IRI}Resource`));
    writer.addQuad(DF.namedNode(label_tree), DF.namedNode(`${util_1.SHAPE_TREE_PREFIX_IRI}shape`), DF.namedNode(shape_path));
    writer.addQuad(DF.namedNode(label_tree), DF.namedNode(`${util_1.SOLID_IRI}${(0, fs_1.lstatSync)(content_path).isDirectory() ? "instanceContainer" : "instance"}`), DF.namedNode(pod_url_path_from_file_path(content_path)));
}
function pod_url_path_from_file_path(path) {
    const re = /(https?)\/(.*)\/(pods)\/(.*)/;
    const found = path.match(re);
    if (found === null) {
        throw new Error("should be an UNIX path to the pods of SolidBench");
    }
    const [http, name_space, pods, rest_url] = [found[1], found[2], found[3], found[4]];
    return `${http}://${name_space.replace("_", ":")}/${pods}/${rest_url}`;
}
