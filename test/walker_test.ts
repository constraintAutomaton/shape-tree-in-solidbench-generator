import { describe, expect, mock, spyOn, test, } from "bun:test";
import { addShapeDataInPod, ShapeContentPath } from "../lib/walker";
import { getShapeFromPath, SHAPE_MAP, ShapeDontExistError } from '../lib/shapeUtil';

describe('addShapeDataInPod', () => {
    const A_POD_PATH = "foo";
    let spy_injestor = {
        spyGenerateShape(path: string): string | ShapeDontExistError {
            return path;
        },
        spyGenerateShapeTree(shapes: Array<ShapeContentPath>, pod_path: string): undefined | Error {
            return undefined
        },
        copyFileSync(path_1: string, path_2: string) { return null },
    };



    test("given a pod with multiple content with registered shapes should generate the shape", async () => {
        const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
        await mock.module("fs", () => {
            return {
                readdirSync: (path: string) => {
                    const resp = [];
                    for (const shape_name of SHAPE_MAP.keys()) {
                        resp.push(shape_name);
                    }
                    return resp;
                },
                copyFileSync: spy_copy_file_sync
            }
        });
        const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
        const spy_generate_shape_tree = spyOn(spy_injestor, 'spyGenerateShapeTree');


        addShapeDataInPod({
            pod_path: A_POD_PATH,
            generate_shape: spy_generate_shape,
            generate_shape_tree: spy_generate_shape_tree,
        });


        expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
        expect(spy_generate_shape_tree).toHaveBeenCalled()
        expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size)
    });

    test("given a pod with multiple content with registered shapes and content with non registered shapes should generate the shape and an array of error", async () => {
        const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
        const unregistred_content = ["a", "b", "c"];
        await mock.module("fs", () => {
            return {
                readdirSync: (path: string) => {
                    const resp = [];
                    for (const shape_name of SHAPE_MAP.keys()) {
                        resp.push(shape_name);
                    }
                    return resp.concat(unregistred_content);
                },
                copyFileSync: spy_copy_file_sync,
            }
        });

        const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
        const spy_generate_shape_tree = spyOn(spy_injestor, 'spyGenerateShapeTree');

        const resp = addShapeDataInPod({
            pod_path: A_POD_PATH,
            generate_shape: spy_generate_shape,
            generate_shape_tree: spy_generate_shape_tree,
        });


        expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
        expect(spy_generate_shape_tree).toHaveBeenCalled()
        expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size)

        expect(resp?.length).toBe(unregistred_content.length);
    });
});