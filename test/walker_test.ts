import { describe, expect, mock, spyOn, test } from "bun:test";
import { explorePod } from "../lib/walker";

describe('explorePod', () => {
    const A_POD_PATH = "foo";
    test("given a pod with multiple content with registered shapes should generate the shape", () => {
        mock.module("fs", () => {
            return {
                readdirSync: (path: string) => {
                    console.log("I have been called");
                    return [];
                }
            }
        });
        explorePod(A_POD_PATH);
    });
});