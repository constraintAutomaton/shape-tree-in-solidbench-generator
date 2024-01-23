import { describe, expect, test, mock, afterEach, spyOn, beforeEach } from "bun:test";
import { generateShapeTreesFile } from "../lib/shapeTreesUtil";
import { jest } from 'bun:test';
import type { ShapeContentPath } from '../lib/util';
import type { Writer } from "n3";


describe('generateShapeTrees', () => {
    const spy_injestor = {
        appendFileSync(_path: string, _data: string) { return null }
    };
    let spy_append_file_sync: any = null;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    beforeEach(async () => {
        spy_append_file_sync = spyOn(spy_injestor, 'appendFileSync');
        await mock.module("fs", () => {
            return {
                appendFileSync: spy_append_file_sync,
            }
        });
    });

    test("Given an empty array of content and a pod path should generate the shapetree document and return no error", async () => {
        const shape_content: Array<ShapeContentPath> = [];
        const pod_path = "foo";

        const resp = generateShapeTreesFile(shape_content, pod_path);

        expect(resp).toBeUndefined();
        expect(spy_append_file_sync).toHaveBeenCalledTimes(1);
    });

    test("Given an array of content and a pod path should generate the shapetree document and return no error", async () => {
        const shape_content: Array<ShapeContentPath> = [
            {
                shape: "foo",
                content: "bar"
            },
            {
                shape: "foo1",
                content: "bar1"
            },
            {
                shape: "foo2",
                content: "bar2"
            }
        ];
        const pod_path = "foo";

        const resp = generateShapeTreesFile(shape_content, pod_path);

        await mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path: string, _content_path: string, _writer: Writer) => {
                    return null
                },
            }
        });

        expect(resp).toBeUndefined();
        expect(spy_append_file_sync).toHaveBeenCalledTimes(1);
    });

})