import { describe, expect, test } from "bun:test";
import { getShapeFromPath, ShapeDontExistError } from '../lib/shapeUtil';
import { parse } from "path";


describe('getShapeFromPath', () => {
    test('should return an error given a path without a basename not related to data in a solid pod of solid bench', () => {
        const path = "./foo/bar/foo/bar";
        const resp = getShapeFromPath(path);
        expect(resp).toBeInstanceOf(ShapeDontExistError);
    });

    test('should return the right shape given a path with a base name related to information inside a pod of solid bench', () => {
        const generate_path = (info: string) => `./foo/bar/foo/${info}`;
        const information = ['posts', 'posts.ttl'];
        for (const info of information) {
            const path = generate_path(info);
            const resp = getShapeFromPath(path);
            expect(resp).toBeTypeOf('string');
            expect(resp).toContain(parse(info).name)
        }

    });
})