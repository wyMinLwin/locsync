import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

export default [
    // esm & cjs
    {
        input: "src/index.ts",
        output: [
            { file: "dist/index.esm.js", format: "esm", sourcemap: true },
            { file: "dist/index.cjs.js", format: "cjs", sourcemap: true },
        ],
        plugins: [resolve(), commonjs(), typescript({ tsconfig: "./tsconfig.json" }), terser()],
    },
    // umd
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.umd.js",
            format: "umd",
            name: "locsync",
            sourcemap: true,
        },
        plugins: [resolve({ browser: true }), commonjs(), typescript(), terser()],
    },
    // Type declarations
    {
        input: "dist/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        plugins: [dts()],
    },
]
