Bun.build({
  entrypoints: [
    "./src",
    "./src/plugin/bun-preload",
    "./src/plugin/bun",
    "./src/plugin/rollup",
  ],
  outdir: "./dist",
  format: "esm",
  splitting: true,
  target: "node",
  external: ["bun", "typescript"],
});
