import path from "path";
import fs from "fs";

import * as TJS from "typescript-json-schema";

// optionally pass argument to schema generator
const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: ["if", "then", "else"],
  defaultNumberType: "integer"
};

// optionally pass ts compiler options
/*const compilerOptions: TJS.CompilerOptions = {
  strictNullChecks: true
};*/

// optionally pass a base path
const basePath = "./my-dir";

const program = TJS.programFromConfig(
  path.resolve(__dirname, "../tsconfig.json"),
  ["src/js/protocol/types.ts"]
);

// We can either get the schema for one file and one type...
//const schema = TJS.generateSchema(program, "*", settings);

const generator = TJS.buildGenerator(program, settings);
if (!generator) {
  throw new Error("Generator failed!");
}

const symbols = generator.getMainFileSymbols(program);

const outputDir = path.resolve(__dirname, "../src/js/__schemas__/");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

for (const symbol of symbols.filter(s => /Message$/.test(s))) {
  console.log(symbol);
  fs.writeFileSync(
    path.resolve(outputDir, `${symbol}.json`),
    JSON.stringify(generator.getSchemaForSymbol(symbol), null, 2),
    "utf8"
  );
}

/*
// ... or a generator that lets us incrementally get more schemas

const generator = TJS.buildGenerator(program, settings);
if (!generator) {
  throw new Error("Generator failed!");
}

// all symbols
const symbols = generator.getUserSymbols();

// Get symbols for different types from generator.
generator.getSchemaForSymbol("MyType");
generator.getSchemaForSymbol("AnotherType");
*/
