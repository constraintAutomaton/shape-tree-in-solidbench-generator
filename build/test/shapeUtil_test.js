"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bun_test_1 = require("bun:test");
const shapeUtil_1 = require("../lib/shapeUtil");
const util_1 = require("../lib/util");
const path_1 = require("path");
(0, bun_test_1.describe)('getShapeFromPath', () => {
    (0, bun_test_1.test)('should return an error given a path without a base name not related to data in a solid pod of SolidBench', () => {
        const path = "./foo/bar/foo/bar";
        const resp = (0, shapeUtil_1.getShapeFromPath)(path);
        (0, bun_test_1.expect)(resp).toBeInstanceOf(util_1.ShapeDontExistError);
    });
    (0, bun_test_1.test)('should return the right shape given a path with a base name related to data inside a pod of SolidBench', () => {
        const generate_path = (info) => `./foo/bar/foo/${info}`;
        const information = ['posts', 'posts.ttl'];
        for (const info of information) {
            const path = generate_path(info);
            const resp = (0, shapeUtil_1.getShapeFromPath)(path);
            (0, bun_test_1.expect)(resp).toBeTypeOf('string');
            (0, bun_test_1.expect)(resp).toContain((0, path_1.parse)(info).name);
        }
    });
});
