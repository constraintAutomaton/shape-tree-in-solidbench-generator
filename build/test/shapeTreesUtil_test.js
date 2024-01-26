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
const bun_test_1 = require("bun:test");
const shapeTreesUtil_1 = require("../lib/shapeTreesUtil");
const bun_test_2 = require("bun:test");
(0, bun_test_1.describe)('generateShapeTreesFile', () => {
    const spy_injestor = {
        appendFileSync(_path, _data) { return null; }
    };
    let spy_append_file_sync = null;
    (0, bun_test_1.afterEach)(() => {
        bun_test_2.jest.restoreAllMocks();
    });
    (0, bun_test_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        spy_append_file_sync = (0, bun_test_1.spyOn)(spy_injestor, 'appendFileSync');
        yield bun_test_1.mock.module("fs", () => {
            return {
                appendFileSync: spy_append_file_sync,
            };
        });
    }));
    (0, bun_test_1.test)("Given an empty array of content and shape, and a pod path should generate the shapetree document and return no errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const shape_content = [];
        const pod_path = "foo";
        const resp = (0, shapeTreesUtil_1.generateShapeTreesFile)(shape_content, pod_path);
        (0, bun_test_1.expect)(resp).toBeUndefined();
        (0, bun_test_1.expect)(spy_append_file_sync).toHaveBeenCalledTimes(1);
    }));
    (0, bun_test_1.test)("Given an array of content and shape, a pod path should generate the shapetree document and return no errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const shape_content = [
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
        yield bun_test_1.mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path, _content_path, _writer) => {
                    return null;
                },
            };
        });
        const resp = (0, shapeTreesUtil_1.generateShapeTreesFile)(shape_content, pod_path);
        (0, bun_test_1.expect)(resp).toBeUndefined();
        (0, bun_test_1.expect)(spy_append_file_sync).toHaveBeenCalledTimes(1);
    }));
    (0, bun_test_1.test)("Given an array of content with non-Unix paths to SolidBench for the content should throw an error", () => __awaiter(void 0, void 0, void 0, function* () {
        const shape_content = [
            {
                shape: "foo",
                content: "http"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";
        yield bun_test_1.mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path, _content_path, _writer) => {
                    return null;
                },
            };
        });
        (0, bun_test_1.expect)(() => (0, shapeTreesUtil_1.generateShapeTreesFile)(shape_content, pod_path)).toThrow();
    }));
    (0, bun_test_1.test)("Given an array of content and shape with non-Unix paths to SolidBench for the shapes should throw an error", () => __awaiter(void 0, void 0, void 0, function* () {
        const shape_content = [
            {
                shape: "foo",
                content: "http/localhost_30340/pods/00000000000000000065/post"
            }
        ];
        const pod_path = "http/localhost_30340/pods/00000000000000000065/";
        yield bun_test_1.mock.module("../lib/shapeTreesUtil", () => {
            return {
                generateTreeAShapeTree: (_shape_path, _content_path, _writer) => {
                    return null;
                },
            };
        });
        (0, bun_test_1.expect)(() => (0, shapeTreesUtil_1.generateShapeTreesFile)(shape_content, pod_path)).toThrow();
    }));
});
