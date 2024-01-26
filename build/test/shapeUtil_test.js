import { describe, expect, test } from "bun:test";
import { getShapeFromPath } from '../lib/shapeUtil';
import { ShapeDontExistError } from '../lib/util';
import { parse } from "path";
describe('getShapeFromPath', () => {
    test('should return an error given a path without a base name not related to data in a solid pod of SolidBench', () => {
        const path = "./foo/bar/foo/bar";
        const resp = getShapeFromPath(path);
        expect(resp).toBeInstanceOf(ShapeDontExistError);
    });
    test('should return the right shape given a path with a base name related to data inside a pod of SolidBench', () => {
        const generate_path = (info) => `./foo/bar/foo/${info}`;
        const information = ['posts', 'posts.ttl'];
        for (const info of information) {
            const path = generate_path(info);
            const resp = getShapeFromPath(path);
            expect(resp).toBeTypeOf('string');
            expect(resp).toContain(parse(info).name);
        }
    });
});
