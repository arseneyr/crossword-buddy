import path from "path";
import fs from "fs";
import * as TJS from "typescript-json-schema";

const settings: TJS.PartialArgs = {
  required: true,
  validationKeywords: ["if", "then", "else"],
  defaultNumberType: "integer"
};

const program = TJS.programFromConfig(
  path.resolve(__dirname, "../tsconfig.json"),
  ["src/js/protocol/types.ts"]
);

const generator = TJS.buildGenerator(program, settings)!;
if (!generator) {
  throw new Error("Generator failed!");
}

export function getSchemaForSymbol(symbol: string) {
  return generator.getSchemaForSymbol(symbol);
}

export function writeAllSchemas() {
  const outputDir = path.resolve(__dirname, "../src/js/__schemas__/");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const symbols = generator.getMainFileSymbols(program);

  for (const symbol of symbols.filter(s => /Message$/.test(s))) {
    console.log(symbol);
    fs.writeFileSync(
      path.resolve(outputDir, `${symbol}.json`),
      JSON.stringify(generator.getSchemaForSymbol(symbol), null, 2),
      "utf8"
    );
  }
}
