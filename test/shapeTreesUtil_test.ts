import { generateShapeTreesFile } from "../lib/shapeTreesUtil";
import type { ShapeContentPath } from '../lib/util';
import type { Writer } from "n3";
import { appendFileSync, lstatSync } from 'fs';

jest.mock('fs');
(<jest.Mock>appendFileSync).mockImplementation((_path: string, _data: string) => null);
jest.mock('../lib/shapeTreesUtil', () => ({
    ...<any>jest.requireActual('../lib/shapeTreesUtil'),
    generateTreeAShapeTree(_shape_path: string, _content_path: string, _writer: Writer) {
        return null;
    }
}));

describe('generateShapeTreesFile', () => {
    afterEach(()=>{
        (<jest.Mock> appendFileSync).mockReset();
    });

    test("Given an empty array of content and shape, and a pod path should generate the shapetree document and return no errors", async () => {
        const shape_content: Array<ShapeContentPath> = [];
        const pod_path = "foo";

        const resp = generateShapeTreesFile(shape_content, pod_path);

        expect(resp).toBeUndefined();
        expect(appendFileSync).toHaveBeenCalledTimes(1);
    });

    test("Given an array of content and shape, a pod path should generate the shapetree document and return no errors", async () => {
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
        let prevVal = true;
        (<jest.Mock>lstatSync).mockReturnValue({
            isDirectory: () => { prevVal = !prevVal; return prevVal; }
        });
        const resp = generateShapeTreesFile(shape_content, pod_path);

        expect(resp).toBeUndefined();
        expect(appendFileSync).toHaveBeenCalledTimes(1);
    });

    test("Given an array of content with non-Unix paths to SolidBench for the content should throw an error", async () => {
        const shape_content: Array<ShapeContentPath> = [
            {
                shape: "foo",
                content: "http"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";

        expect(() => generateShapeTreesFile(shape_content, pod_path)).toThrow();
    });

    test("Given an array of content and shape with non-Unix paths to SolidBench for the shapes should throw an error", async () => {
        const shape_content: Array<ShapeContentPath> = [
            {
                shape: "foo",
                content: "http/localhost_30340/pods/00000000000000000065/post"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";

        expect(() => generateShapeTreesFile(shape_content, pod_path)).toThrow();
    });


})