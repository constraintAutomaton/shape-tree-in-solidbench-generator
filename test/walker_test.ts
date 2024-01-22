import { beforeEach, describe, expect, mock, spyOn, test, } from "bun:test";
import { addShapeDataInPod, walkSolidPods } from "../lib/walker";
import { getShapeFromPath, SHAPE_MAP } from '../lib/shapeUtil';
import { Config, ShapeContentPath, ShapeTreesCannotBeGenerated, ShapeDontExistError } from "../lib/util";

describe('walker', () => {
    describe('addShapeDataInPod', () => {
        const A_POD_PATH = "foo";
        let spy_injestor: any;

        beforeEach(() => {
            spy_injestor = {
                spyGenerateShape(path: string): string | ShapeDontExistError {
                    return path;
                },
                spyGenerateShapeTree(shapes: Array<ShapeContentPath>, pod_path: string): undefined | Error {
                    return undefined
                },
                copyFileSync(path_1: string, path_2: string) { return null },
            };
        })


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
                generate_shape_trees: spy_generate_shape_tree,
            });


            expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(spy_generate_shape_tree).toHaveBeenCalled();
            expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size);
        });

        test("given a pod with multiple content with registered shapes and content with non registered shapes should generate the shape and an array of error", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            await mock.module("fs", () => {
                return {
                    readdirSync: (path: string) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp.concat(unregistred_contents);
                    },
                    copyFileSync: spy_copy_file_sync,
                }
            });

            spy_injestor.spyGenerateShape = (path: string): string | ShapeDontExistError => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            }

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
                    readdirSync: (path: string) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp.concat(unregistred_contents);
                    },
                    copyFileSync: spy_copy_file_sync,
                }
            });

            spy_injestor.spyGenerateShape = (path: string): string | ShapeDontExistError => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            }


            const resp = addShapeDataInPod({
                pod_path: A_POD_PATH,
            });

            expect(resp).toBeUndefined()

        });

        test("should return an error if the shape tree generator return an error", async () => {
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

            spy_injestor.spyGenerateShapeTree = () => {
                return new ShapeTreesCannotBeGenerated("")
            }
            const spy_generate_shape = spyOn(spy_injestor, "spyGenerateShape");
            const spy_generate_shape_tree = spyOn(spy_injestor, 'spyGenerateShapeTree');


            const resp = addShapeDataInPod({
                pod_path: A_POD_PATH,
                generate_shape: spy_generate_shape,
                generate_shape_trees: spy_generate_shape_tree,
            });


            expect(spy_copy_file_sync).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(spy_generate_shape_tree).toHaveBeenCalled();
            expect(spy_generate_shape).toHaveBeenCalledTimes(SHAPE_MAP.size);
            expect(resp?.length).toBe(1);

        });

        test("given a pod with multiple content with registered and unregisted shapes and with no shape trees generator should generate the shape and an array of error", async () => {
            const spy_copy_file_sync = spyOn(spy_injestor, 'copyFileSync');
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            await mock.module("fs", () => {
                return {
                    readdirSync: (path: string) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp.concat(unregistred_contents);
                    },
                    copyFileSync: spy_copy_file_sync,
                }
            });

            spy_injestor.spyGenerateShape = (path: string): string | ShapeDontExistError => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            }

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

        let config: any = null;

        let spy_injestor: any;

        beforeEach(() => {
            spy_injestor = {
                spyGenerateShape(path: string): string | ShapeDontExistError {
                    return path;
                },
                spyGenerateShapeTree(_shapes: Array<ShapeContentPath>, pod_path: string): undefined | ShapeTreesCannotBeGenerated {
                    return undefined
                },
                copyFileSync(path_1: string, path_2: string) { return null },
            };

            config = {
                pod_folder: "",
                generate_shape: spy_injestor.spyGenerateShape,
                generate_shape_trees: spy_injestor.spyGenerateShapeTree
            };
        })


        test('Given that there is no error in adding data inside pods then it should return an empty array', async () => {
            await mock.module("fs", () => {
                return {
                    readdirSync: (_path: string) => {
                        const resp = [];
                        for (const shape_name of SHAPE_MAP.keys()) {
                            resp.push(shape_name);
                        }
                        return resp;
                    },
                    copyFileSync: (_path_1: string, _path_2: string) => {
                        return null;
                    },
                    lstatSync: (_path: string) => {
                        return {
                            isDirectory: () => {
                                return true;
                            }
                        }
                    }
                }
            });

            const resp = await walkSolidPods(config);

            expect(resp).toBeUndefined();
        });

        test('Given that adding data to the pods return only errors then the array should be full of errors', async () => {
            const n = 100;

            await mock.module("fs", () => {
                return {
                    readdirSync: (_path: string) => {
                        const resp = [];
                        for (let i = 0; i < n; i++) {
                            resp.push(String(i));
                        }
                        return resp;
                    },
                    copyFileSync: (_path_1: string, _path_2: string) => {
                        return null;
                    },
                    lstatSync: (_path: string) => {
                        return {
                            isDirectory: () => {
                                return true;
                            }
                        }
                    }
                }
            });


            config.generate_shape = (_path: string): string | ShapeDontExistError => {
                return new ShapeDontExistError("");
            };


            const resp = await walkSolidPods(config);

            expect(resp?.length).toBe(n);
        });

        test('Given that adding data to the pods return sometime errors then the array have the corresponding errors', async () => {
            const n = 10;
            let i_shape_trees_generated = 0;
            let frequency_errors = 2;
            await mock.module("fs", () => {
                return {
                    readdirSync: (_path: string) => {
                        const resp = [];
                        for (let i = 0; i < n; i++) {
                            resp.push("posts");
                        }
                        return resp;
                    },
                    copyFileSync: (_path_1: string, _path_2: string) => {
                        return null;
                    },
                    lstatSync: (_path: string) => {
                        return {
                            isDirectory: () => {
                                return true;
                            }
                        }
                    }
                }
            });

            config.generate_shape_trees = (_shapes: Array<ShapeContentPath>, _pod_path: string): undefined | ShapeTreesCannotBeGenerated => {
                i_shape_trees_generated += 1;
                if (((i_shape_trees_generated - 1) % frequency_errors) === 0) {
                    return new ShapeTreesCannotBeGenerated(`${i_shape_trees_generated}`);
                }
            };

            const resp = await walkSolidPods(config);
            expect(resp?.length).toBe(n / frequency_errors);

        });
    });
});
