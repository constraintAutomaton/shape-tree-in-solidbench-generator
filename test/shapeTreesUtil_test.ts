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
                shape: "http/localhost_30340/pods/00000000000000000065/d/shape",
                content: "http/localhost_30340/pods/00000000000000000065/d"
            },
            {
                shape: "http/localhost_30340/pods/00000000000000000065/abc/shape",
                content: "http/localhost_30340/pods/00000000000000000065/abc"
            },
            {
                shape: "http/localhost_30340/pods/00000000000000000065/d.shape",
                content: "http/localhost_30340/pods/00000000000000000065/post"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";

        await mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path: string, _content_path: string, _writer: Writer) => {
                    return null
                },
            }
        });

        const resp = generateShapeTreesFile(shape_content, pod_path);



        expect(resp).toBeUndefined();
        expect(spy_append_file_sync).toHaveBeenCalledTimes(1);
    });

    test("Given an array of content with non unix path content should throw", async () => {
        const shape_content: Array<ShapeContentPath> = [
            {
                shape: "foo",
                content: "http"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";

        await mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path: string, _content_path: string, _writer: Writer) => {
                    return null
                },
            }
        });
        expect(()=>generateShapeTreesFile(shape_content, pod_path)).toThrow();
    });

    test("Given an array of content with non unix path shape should throw", async () => {
        const shape_content: Array<ShapeContentPath> = [
            {
                shape: "foo",
                content: "http/localhost_30340/pods/00000000000000000065/post"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";

        await mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path: string, _content_path: string, _writer: Writer) => {
                    return null
                },
            }
        });
        expect(()=>generateShapeTreesFile(shape_content, pod_path)).toThrow();
    });


})