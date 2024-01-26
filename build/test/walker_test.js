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
const walker_1 = require("../lib/walker");
const shapeUtil_1 = require("../lib/shapeUtil");
const util_1 = require("../lib/util");
const bun_test_2 = require("bun:test");
(0, bun_test_1.describe)('walker', () => {
    (0, bun_test_1.describe)('addShapeDataInPod', () => {
        const A_POD_PATH = "foo";
        let spy_injestor;
        (0, bun_test_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            spy_injestor = {
                spyGenerateShape(path) {
                    return path;
                },
                spyGenerateShapeTree(shapes, pod_path) {
                    return undefined;
                },
                copyFileSync(path_1, path_2) { return null; },
            };
            yield bun_test_1.mock.module("fs", () => {
                return {
                    statSync: (_path) => {
                        return {
                            isDirectory: () => true
                        };
                    }
                };
            });
        }));
        (0, bun_test_1.afterEach)(() => {
            bun_test_2.jest.restoreAllMocks();
        });
        (0, bun_test_1.test)("given a pod with multiple contents associated with shapes should generate the shape when the path is directory", () => __awaiter(void 0, void 0, void 0, function* () {
            const spy_copy_file_sync = (0, bun_test_1.spyOn)(spy_injestor, 'copyFileSync');
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (const shape_name of shapeUtil_1.SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp;
                    },
                    copyFileSync: spy_copy_file_sync
                };
            });
            const spy_generate_shape = (0, bun_test_1.spyOn)(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = (0, bun_test_1.spyOn)(spy_injestor, 'spyGenerateShapeTree');
            (0, walker_1.addShapeDataInPod)({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });
            (0, bun_test_1.expect)(spy_copy_file_sync).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size);
            (0, bun_test_1.expect)(spy_generate_shape_tree).toHaveBeenCalled();
            (0, bun_test_1.expect)(spy_generate_shape).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size);
        }));
        (0, bun_test_1.test)("given a pod with multiple contents associated with shapes should generate the shape when the path is a file", () => __awaiter(void 0, void 0, void 0, function* () {
            const spy_copy_file_sync = (0, bun_test_1.spyOn)(spy_injestor, 'copyFileSync');
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (const shape_name of shapeUtil_1.SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp;
                    },
                    copyFileSync: spy_copy_file_sync
                };
            });
            yield bun_test_1.mock.module("fs", () => {
                return {
                    statSync: (_path) => {
                        return {
                            isDirectory: () => false
                        };
                    }
                };
            });
            const spy_generate_shape = (0, bun_test_1.spyOn)(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = (0, bun_test_1.spyOn)(spy_injestor, 'spyGenerateShapeTree');
            (0, walker_1.addShapeDataInPod)({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });
            (0, bun_test_1.expect)(spy_copy_file_sync).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size);
            (0, bun_test_1.expect)(spy_generate_shape_tree).toHaveBeenCalled();
            (0, bun_test_1.expect)(spy_generate_shape).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size);
        }));
        (0, bun_test_1.test)("given a pod with multiple contents where some are associated with shapes and others are not should generate the shape and an array of error", () => __awaiter(void 0, void 0, void 0, function* () {
            const spy_copy_file_sync = (0, bun_test_1.spyOn)(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (path) => {
                        const resp = [];
                        for (const shape_name of shapeUtil_1.SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp.concat(unregistred_contents);
                    },
                    copyFileSync: spy_copy_file_sync,
                };
            });
            spy_injestor.spyGenerateShape = (path) => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new util_1.ShapeDontExistError("");
                    }
                }
                return path;
            };
            const spy_generate_shape = (0, bun_test_1.spyOn)(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = (0, bun_test_1.spyOn)(spy_injestor, 'spyGenerateShapeTree');
            const resp = (0, walker_1.addShapeDataInPod)({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });
            (0, bun_test_1.expect)(resp === null || resp === void 0 ? void 0 : resp.length).toBe(unregistred_contents.length);
            (0, bun_test_1.expect)(spy_copy_file_sync).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size);
            (0, bun_test_1.expect)(spy_generate_shape_tree).toHaveBeenCalledTimes(1);
            (0, bun_test_1.expect)(spy_generate_shape).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size + unregistred_contents.length);
        }));
        (0, bun_test_1.test)("given no shape generator function should do nothing and return undefined", () => __awaiter(void 0, void 0, void 0, function* () {
            const spy_copy_file_sync = (0, bun_test_1.spyOn)(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (path) => {
                        const resp = [];
                        for (const shape_name of shapeUtil_1.SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp.concat(unregistred_contents);
                    },
                    copyFileSync: spy_copy_file_sync,
                };
            });
            spy_injestor.spyGenerateShape = (path) => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new util_1.ShapeDontExistError("");
                    }
                }
                return path;
            };
            const resp = (0, walker_1.addShapeDataInPod)({
                pod_path: A_POD_PATH,
            });
            (0, bun_test_1.expect)(resp).toBeUndefined();
        }));
        (0, bun_test_1.test)("given no shape tree generator function and a shape generator function should return the valid shapes", () => __awaiter(void 0, void 0, void 0, function* () {
            const spy_copy_file_sync = (0, bun_test_1.spyOn)(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (path) => {
                        const resp = [];
                        for (const shape_name of shapeUtil_1.SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp.concat(unregistred_contents);
                    },
                    copyFileSync: spy_copy_file_sync,
                };
            });
            spy_injestor.spyGenerateShape = (path) => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new util_1.ShapeDontExistError("");
                    }
                }
                return path;
            };
            const spy_generate_shape = (0, bun_test_1.spyOn)(spy_injestor, "spyGenerateShape");
            const resp = (0, walker_1.addShapeDataInPod)({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
            });
            (0, bun_test_1.expect)(resp === null || resp === void 0 ? void 0 : resp.length).toBe(unregistred_contents.length);
            (0, bun_test_1.expect)(spy_copy_file_sync).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size);
            (0, bun_test_1.expect)(spy_generate_shape).toHaveBeenCalledTimes(shapeUtil_1.SHAPE_MAP.size + unregistred_contents.length);
        }));
    });
    (0, bun_test_1.describe)('walkSolidPods', () => {
        let config = null;
        let spy_injestor;
        (0, bun_test_1.beforeEach)(() => {
            spy_injestor = {
                spyGenerateShape(path) {
                    return path;
                },
                spyGenerateShapeTree(_shapes, _pod_path) {
                },
                copyFileSync(path_1, path_2) { return null; },
            };
            config = {
                pod_folder: "",
                generate_shape: spy_injestor.spyGenerateShape,
                generate_shape_trees: spy_injestor.spyGenerateShapeTree
            };
        });
        (0, bun_test_1.test)('given that the shape generator return no error then undefined should be returned', () => __awaiter(void 0, void 0, void 0, function* () {
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (const shape_name of shapeUtil_1.SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp;
                    },
                    copyFileSync: (_path_1, _path_2) => {
                        return null;
                    },
                    lstatSync: (_path) => {
                        return {
                            isDirectory: () => {
                                return true;
                            }
                        };
                    }
                };
            });
            const resp = yield (0, walker_1.walkSolidPods)(config);
            (0, bun_test_1.expect)(resp).toBeUndefined();
        }));
        (0, bun_test_1.test)('given that the shape generator always returned errors then an array of error should be returned', () => __awaiter(void 0, void 0, void 0, function* () {
            const n = 100;
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (let i = 0; i < n; i++) {
                            resp.push(String(i));
                        }
                        return resp;
                    },
                    copyFileSync: (_path_1, _path_2) => {
                        return null;
                    },
                    lstatSync: (_path) => {
                        return {
                            isDirectory: () => {
                                return true;
                            }
                        };
                    }
                };
            });
            config.generate_shape = (_path) => {
                return new util_1.ShapeDontExistError("");
            };
            const resp = yield (0, walker_1.walkSolidPods)(config);
            (0, bun_test_1.expect)(resp === null || resp === void 0 ? void 0 : resp.length).toBe(n);
        }));
        (0, bun_test_1.test)('given that the shape generator return some errors then an array of error should be returned', () => __awaiter(void 0, void 0, void 0, function* () {
            const n = 10;
            let i_shape_generator = 0;
            let frequency_errors = 50;
            yield bun_test_1.mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (let i = 0; i < n; i++) {
                            resp.push("posts");
                        }
                        return resp;
                    },
                    copyFileSync: (_path_1, _path_2) => {
                        return null;
                    },
                    lstatSync: (_path) => {
                        return {
                            isDirectory: () => {
                                return true;
                            }
                        };
                    }
                };
            });
            config.generate_shape = (_path) => {
                i_shape_generator += 1;
                if (((i_shape_generator - 1) % frequency_errors) === 0) {
                    return new util_1.ShapeDontExistError("");
                }
                return "";
            };
            const resp = yield (0, walker_1.walkSolidPods)(config);
            (0, bun_test_1.expect)(resp === null || resp === void 0 ? void 0 : resp.length).toBe((n * n) / frequency_errors);
        }));
    });
});
