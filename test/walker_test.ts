import { addShapeDataInPod, walkSolidPods } from "../lib/walker";
import { SHAPE_MAP, generateShapeFromPath } from '../lib/shapeUtil';
import { generateShapeTreesFile } from "../lib/shapeTreesUtil";
import { ShapeContentPath, ShapeDontExistError } from "../lib/util";
import { copyFileSync, readdirSync, lstatSync } from 'fs';

let filesReturnedByreaddirSync: Array<string> = [];
let isDirectoryResponse: boolean = true;

jest.mock('fs');

jest.mock('../lib/shapeUtil');

jest.mock('../lib/shapeTreesUtil');

const dataType = ["a", "b", "c"];

describe('walker', () => {

    beforeEach(() => {
        (<jest.Mock>readdirSync).mockReturnValue(filesReturnedByreaddirSync);
        (<jest.Mock>copyFileSync).mockReturnValue(null);
        (<jest.Mock>generateShapeFromPath).mockReturnValue('foo');
        (<jest.Mock>lstatSync).mockReturnValue({
            isDirectory: () => isDirectoryResponse
        });
        (<jest.Mock>generateShapeTreesFile).mockReturnValueOnce(undefined);
    });

    afterEach(() => {
        (<jest.Mock>readdirSync).mockClear();
        (<jest.Mock>copyFileSync).mockClear();
        (<jest.Mock>generateShapeFromPath).mockClear();
        (<jest.Mock>lstatSync).mockClear();
        (<jest.Mock>generateShapeTreesFile).mockClear();

    });

    describe('addShapeDataInPod', () => {
        const A_POD_PATH = "foo";

        test("given a pod with multiple contents associated with shapes should generate the shape when the path is directory", async () => {
            filesReturnedByreaddirSync = Array.from(dataType);
            (<jest.Mock>readdirSync).mockReturnValueOnce(filesReturnedByreaddirSync);
            addShapeDataInPod({
                pod_path: A_POD_PATH,
            });

            expect(copyFileSync).toHaveBeenCalledTimes(dataType.length);
            expect(generateShapeFromPath).toHaveBeenCalledTimes(dataType.length);
            expect(generateShapeTreesFile).toHaveBeenCalled();

        });

        test("given a pod with multiple contents associated with shapes should generate the shape when the path is a file", async () => {
            filesReturnedByreaddirSync = Array.from(dataType);
            (<jest.Mock>readdirSync).mockReturnValueOnce(filesReturnedByreaddirSync);
            isDirectoryResponse = false;
            (<jest.Mock>lstatSync).mockReturnValue({
                isDirectory: () => isDirectoryResponse
            });

            addShapeDataInPod({
                pod_path: A_POD_PATH,
            });

            expect(copyFileSync).toHaveBeenCalledTimes(dataType.length);
            expect(generateShapeTreesFile).toHaveBeenCalled();
            expect(generateShapeFromPath).toHaveBeenCalledTimes(dataType.length);
        });

        test("given a pod with multiple contents where some are associated with shapes and others are not should generate the shape and an array of error", async () => {
            const unregistred_contents = ["unregistred_a", "unregistred_b", "unregistred_c"];
            filesReturnedByreaddirSync = Array.from(dataType).concat(unregistred_contents);
            (<jest.Mock>readdirSync).mockReturnValueOnce(filesReturnedByreaddirSync);

            (<jest.Mock>generateShapeFromPath).mockImplementation((path: string): string | ShapeDontExistError => {
                for (const content of unregistred_contents) {
                    if (path.includes(content)) {
                        return new ShapeDontExistError("");
                    }
                }
                return path;
            });

            const resp = addShapeDataInPod({
                pod_path: A_POD_PATH,
            });

            expect(resp?.length).toBe(unregistred_contents.length);

            expect(copyFileSync).toHaveBeenCalledTimes(dataType.length);
            expect(generateShapeTreesFile).toHaveBeenCalledTimes(1);
            expect(generateShapeFromPath).toHaveBeenCalledTimes(dataType.length + unregistred_contents.length);

        });

    });

    describe('walkSolidPods', () => {

        let config: any = null;

        beforeEach(() => {
            config = {
                pod_folder: "pod",
            };
        })


        test('given that the shape generator return no error then undefined should be returned', async () => {
            filesReturnedByreaddirSync = Array.from(dataType);
            (<jest.Mock>readdirSync).mockImplementation(()=>{
                return filesReturnedByreaddirSync;
            });
            (<jest.Mock>generateShapeTreesFile).mockReturnValueOnce(undefined);

            const resp = await walkSolidPods(config);

            expect(resp).toBeUndefined();
        });

        test('given that the shape generator always returned errors then an array of error should be returned', async () => {
            const n = 100;
            filesReturnedByreaddirSync = [];
            for (let i = 0; i < n; i++) {
                filesReturnedByreaddirSync.push(String(i));
            }
            isDirectoryResponse = true;


            (<jest.Mock>generateShapeFromPath).mockImplementation((path: string): string | ShapeDontExistError => {
                return new ShapeDontExistError("");
            });

            const resp = await walkSolidPods(config);

            expect(resp?.length).toBe(n);
        });

        test('given that the shape generator return some errors then an array of error should be returned', async () => {
            const n = 10;
            let i_shape_generator = 0;
            let frequency_errors = 50;
            filesReturnedByreaddirSync = [];
            for (let i = 0; i < n; i++) {
                filesReturnedByreaddirSync.push(String(i));
            }
            isDirectoryResponse = true;

            (<jest.Mock>generateShapeFromPath).mockImplementation((path: string): string | ShapeDontExistError => {
                i_shape_generator += 1;
                if (((i_shape_generator - 1) % frequency_errors) === 0) {
                    return new ShapeDontExistError("");
                }
                return "";
            });

            const resp = await walkSolidPods(config);
            expect(resp?.length).toBe((n * n) / frequency_errors);

        });
    });
});
