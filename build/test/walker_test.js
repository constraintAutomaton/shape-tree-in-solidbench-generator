import { afterEach, beforeEach, describe, expect, mock, spyOn, test, } from "bun:test";
import { addShapeDataInPod, walkSolidPods } from "../lib/walker";
import { SHAPE_MAP } from '../lib/shapeUtil';
import { ShapeDontExistError } from "../lib/util";
import { jest } from 'bun:test';
describe('walker', () => {
    describe('addShapeDataInPod', () => {
        const A_POD_PATH = "foo";
        let spy_injestor;
        beforeEach(async () => {
            spy_injestor = {
                spyGenerateShape(path) {
                    return path;
                },
                spyGenerateShapeTree(shapes, pod_path) {
                    return undefined;
                },
                copyFileSync(path_1, path_2) { return null; },
            };
            await mock.module("fs", () => {
                return {
                    statSync: (_path) => {
                        return {
                            isDirectory: () => true
                        };
                    }
                };
            });
        });
        afterEach(() => {
            jest.restoreAllMocks();
        });
        test("given a pod with multiple contents associated with shapes should generate the shape when the path is directory", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            await mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp;
                    },
                    copyFileSync: spy_copy_file_sync
                };
            });
            const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = spyOn(spy_injestor, 'spyGenerateShapeTree');
            addShapeDataInPod({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });
            expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(spy_generate_shape_tree).toHaveBeenCalled();
            expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size);
        });
        test("given a pod with multiple contents associated with shapes should generate the shape when the path is a file", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            await mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp;
                    },
                    copyFileSync: spy_copy_file_sync
                };
            });
            await mock.module("fs", () => {
                return {
                    statSync: (_path) => {
                        return {
                            isDirectory: () => false
                        };
                    }
                };
            });
            const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = spyOn(spy_injestor, 'spyGenerateShapeTree');
            addShapeDataInPod({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });
            expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(spy_generate_shape_tree).toHaveBeenCalled();
            expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size);
        });
        test("given a pod with multiple contents where some are associated with shapes and others are not should generate the shape and an array of error", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            await mock.module("fs", () => {
                return {
                    readdirSync: (path) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
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
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            };
            const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = spyOn(spy_injestor, 'spyGenerateShapeTree');
            const resp = addShapeDataInPod({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });
            expect(resp?.length).toBe(unregistred_contents.length);
            expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(spy_generate_shape_tree).toHaveBeenCalledTimes(1);
            expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size + unregistred_contents.length);
        });
        test("given no shape generator function should do nothing and return undefined", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            await mock.module("fs", () => {
                return {
                    readdirSync: (path) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
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
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            };
            const resp = addShapeDataInPod({
                pod_path: A_POD_PATH,
            });
            expect(resp).toBeUndefined();
        });
        test("given no shape tree generator function and a shape generator function should return the valid shapes", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            await mock.module("fs", () => {
                return {
                    readdirSync: (path) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
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
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            };
            const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
            const resp = addShapeDataInPod({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
            });
            expect(resp?.length).toBe(unregistred_contents.length);
            expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size + unregistred_contents.length);
        });
    });
    describe('walkSolidPods', () => {
        let config = null;
        let spy_injestor;
        beforeEach(() => {
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
        test('given that the shape generator return no error then undefined should be returned', async () => {
            await mock.module("fs", () => {
                return {
                    readdirSync: (_path) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
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
            const resp = await walkSolidPods(config);
            expect(resp).toBeUndefined();
        });
        test('given that the shape generator always returned errors then an array of error should be returned', async () => {
            const n = 100;
            await mock.module("fs", () => {
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
                return new ShapeDontExistError("");
            };
            const resp = await walkSolidPods(config);
            expect(resp?.length).toBe(n);
        });
        test('given that the shape generator return some errors then an array of error should be returned', async () => {
            const n = 10;
            let i_shape_generator = 0;
            let frequency_errors = 50;
            await mock.module("fs", () => {
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
                    return new ShapeDontExistError("");
                }
                return "";
            };
            const resp = await walkSolidPods(config);
            expect(resp?.length).toBe((n * n) / frequency_errors);
        });
    });
});
