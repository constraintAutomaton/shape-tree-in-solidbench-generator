# shape-tree-in-solid-bench

A library to add RDF shape and [shape trees](https://shapetrees.org/) into [SolidBench](https://github.com/SolidBench/SolidBench.js)

## Installation
```bash
bun install
```
## Usage

```ts
import * as STG from 'shape-tree-in-solid-bench';


const config: STG.Config = {
    pods_folder: "{path of the pods}", // example "out-fragments/http/localhost_3000/pods"
    shape_folders: "{folder of the shapes}", // example at `./shapes` in this repository
    generate_shape: STG.getShapeFromPath,
    generate_shape_trees: STG.generateShapeTreesFile,
};
STG.walkSolidPods(config);
```