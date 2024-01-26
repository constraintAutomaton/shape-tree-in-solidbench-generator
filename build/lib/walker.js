"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addShapeDataInPod = exports.walkSolidPods = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("./util");
/**
 * Walk every pod of a directory
 * @param {Config} config - The parameters for the generation of the shape and shape tree
 * @returns {Promise<Array<Array<Error>> | undefined>} The errors while the generation or undefined if there was no error
 */
function walkSolidPods(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const pods_files = (0, fs_1.readdirSync)(config.pods_folder);
        const errors = [];
        const explore_pods_promises = [];
        for (const pod_path of pods_files) {
            explore_pods_promises.push(new Promise((resolve, reject) => {
                const resp = addShapeDataInPod({
                    pod_path: (0, path_1.join)(config.pods_folder, pod_path),
                    generate_shape: config.generate_shape,
                    generate_shape_trees: config.generate_shape_trees,
                    shape_folder: config.shape_folders
                });
                if (resp === undefined) {
                    resolve(undefined);
                }
                reject(resp);
            }));
        }
        const results = yield Promise.allSettled(explore_pods_promises);
        results.forEach((result) => {
            if (result.status === "rejected") {
                errors.push(result.reason);
            }
        });
        if (errors.length === 0) {
            return undefined;
        }
        return errors;
    });
}
exports.walkSolidPods = walkSolidPods;
/**
 * Add the shape and shape tree inside the pods
 * @returns {undefined | Array<Error>} The errors or undefined if the was no error
 */
function addShapeDataInPod({ pod_path, generate_shape, generate_shape_trees, shape_folder, }) {
    if (generate_shape === undefined && generate_shape_trees === undefined) {
        return undefined;
    }
    const pod_contents = (0, fs_1.readdirSync)(pod_path);
    const error_array = [];
    const file_generation_promises = [];
    // shape path and content path
    const shapes_generated = [];
    for (const pod_content_path of pod_contents) {
        if (generate_shape !== undefined) {
            const content_path = (0, path_1.join)(pod_path, pod_content_path);
            const shape_path = generate_shape(content_path, shape_folder);
            if (shape_path instanceof util_1.ShapeDontExistError) {
                error_array.push(shape_path);
            }
            else {
                file_generation_promises.push(new Promise(() => {
                    let resulting_shape_path;
                    if ((0, fs_1.statSync)(content_path).isDirectory()) {
                        resulting_shape_path = (0, path_1.join)(content_path, (0, path_1.basename)(shape_path));
                    }
                    else {
                        resulting_shape_path = (0, path_1.join)((0, path_1.dirname)(content_path), (0, path_1.basename)(shape_path));
                    }
                    (0, fs_1.copyFileSync)(shape_path, resulting_shape_path);
                    shapes_generated.push({ shape: resulting_shape_path, content: content_path });
                }));
            }
        }
    }
    Promise.all(file_generation_promises);
    if (generate_shape_trees !== undefined) {
        generate_shape_trees(shapes_generated, pod_path);
    }
    if (error_array.length !== 0) {
        return error_array;
    }
}
exports.addShapeDataInPod = addShapeDataInPod;
