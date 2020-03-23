import "reflect-metadata";
import fs from "fs";
import path from "path";
import StateValidator from "../src/js/validator";
import { transformAndValidate } from "class-transformer-validator";

describe.each(
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../nyt/state.json"), "utf8")
  ) as { state: any; url: string }[]
)("state validation tests", ({ state, url }) => {
  test("passes validator", () => {
    return expect(
      transformAndValidate(StateValidator, state, {
        validator: { whitelist: true }
      }).catch(e => {
        e.toJSON = () => JSON.stringify({ url, error: e.toString() }, null, 2);
        throw e;
      })
    ).resolves.toBeDefined();
  });
});
