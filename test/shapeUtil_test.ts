import { generateShapeFromPath, getShapeMap, generateShapeMap } from '../lib/shapeUtil';
import { ShapeDontExistError } from '../lib/util';
import { parse } from "path";
import { readFileSync } from 'fs';

jest.mock('fs');
describe('generateShapeFromPath', () => {
    it('should return an error given a path without a base name not related to data in a solid pod of SolidBench', () => {
        const path = "./foo/bar/foo/bar";
        const resp = generateShapeFromPath(path);
        expect(resp).toBeInstanceOf(ShapeDontExistError);
    });

    it('should return the right shape given a path with a base name related to data inside a pod of SolidBench', () => {
        const generate_path = (info: string) => `./foo/bar/foo/${info}`;
        const information = ['posts', 'posts.ttl'];
        for (const info of information) {
            const path = generate_path(info);
            const resp = generateShapeFromPath(path, undefined);
            expect(typeof resp).toBe('string');
            expect(resp).toContain(parse(info).name)
        }
    });

    it('should return the right shape given a path with a base name related to data inside a pod of SolidBench and a custom shape folder', () => {
        const generate_path = (info: string) => `./foo/bar/foo/${info}`;
        const information = ['posts', 'posts.ttl'];
        for (const info of information) {
            const path = generate_path(info);
            const resp = generateShapeFromPath(path, "foo");
            expect(typeof resp).toBe('string');
            expect(resp).toContain(parse(info).name)
        }
    });
})

describe('generateShapeMap', () => {
    it('should generate a shape given a valid config file', () => {
        (<jest.Mock>readFileSync).mockReturnValueOnce(`{
            "shapes": {
                "comment": "comment.shexc"
            }
        }`);
        const expectedShapeMap = new Map([["comment", "comment.shexc"]]);
        generateShapeMap();

        expect(getShapeMap()).toStrictEqual(expectedShapeMap);
    });
});