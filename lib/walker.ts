import { join, parse } from "path";
import { readdirSync, copyFileSync, lstatSync, appendFileSync } from "fs";
import { getShapeFromPath, ShapeDontExistError } from './shapeUtil';
import { Config, } from './parameters';
import { Term } from "@rdfjs/types";
import { DataFactory } from 'rdf-data-factory';
import type * as RDF from 'rdf-js';
import { v4 as uuidv4 } from 'uuid';
import { Writer } from "n3";


const DF = new DataFactory<RDF.BaseQuad>();

const RDF_TYPE_IRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const SHAPE_TREE_PREFIX_IRI = "http://www.w3.org/ns/shapetrees#";
const SOLID_IRI = "http://www.w3.org/ns/solid/terms#";
const SHAPE_TREE_FILE_NAME = "shapetree.ttl";

// we might not want to assume that
const SOLID_PODS_RELATIVE_PATHS = "http/localhost_3000/pods";

export async function walkSolidPods(config: Config) {
    const path = join(config.solid_bench_start_fragments_folder, SOLID_PODS_RELATIVE_PATHS);
    const pods_files = readdirSync(path);
    const explore_pods_promises = [];
    for (const pod_path of pods_files) {
        explore_pods_promises.push(
            new Promise(() => {
                addShapeDataInPod(
                    {
                        pod_path: join(path, pod_path),
                        generate_shape: getShapeFromPath,
                        generate_shape_tree: generateShapeTrees
                    }


                );
            })
        );
    }
    await Promise.all(explore_pods_promises);
}

export function addShapeDataInPod(
    {
        pod_path,
        generate_shape,
        generate_shape_tree }
        : {
            pod_path: string,
            generate_shape?: (path: string) => string | ShapeDontExistError,
            generate_shape_tree?: (shapes: Array<ShapeContentPath>, pod_path: string) => undefined | Error
        })

    : undefined | Array<Error> {
    if (generate_shape === undefined && generate_shape_tree === undefined) {
        return undefined;
    }
    const pod_contents = readdirSync(pod_path);
    const error_array: ShapeDontExistError[] = [];
    const file_generation_promises = [];
    // shape path and content path
    const shapes_generated: Array<ShapeContentPath> = [];


    for (const pod_content_path of pod_contents) {
        if (generate_shape !== undefined) {
            const content_path = join(pod_path, pod_content_path);
            const shape_path = generate_shape(content_path);
            if (shape_path instanceof ShapeDontExistError) {
                error_array.push(shape_path);
            } else {
                shapes_generated.push({ shape: shape_path, content: content_path });
                file_generation_promises.push(new Promise(() => {
                    copyFileSync(shape_path, pod_path);
                }));
            }
        }
    }

    Promise.all(file_generation_promises);


    if (generate_shape_tree !== undefined) {
        const errors = generate_shape_tree(shapes_generated, pod_path);
        if (errors !== undefined) {
            return error_array.concat(errors);
        }
    } else if (error_array.length !== 0) {
        return error_array
    }

}

function generateShapeTrees(shape_content: Array<ShapeContentPath>, pod_path: string): Error | undefined {
    let success: Error | undefined = undefined;
    const writer = new Writer();
    for (const { shape, content } of shape_content) {
        const quads = generateTreeAShapeTree(shape, content, writer);
    }
    writer.end((error, result) => {
        if (error !== undefined) {
            appendFileSync(join(pod_path, SHAPE_TREE_FILE_NAME), result);
        }
        success = error;
    });
    return success
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

export interface ShapeContentPath {
    shape: string,
    content: string
}