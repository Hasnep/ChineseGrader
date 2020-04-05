import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import { uglify } from "rollup-plugin-uglify";

export default {
  input: "src/index.ts",
  output: { file: "dist/index.js" },
  plugins: [json({ compact: true }), typescript({ tsconfig: "tsconfig.json" }), uglify()],
  treeshake: false,
};
