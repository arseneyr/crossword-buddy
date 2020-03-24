import fs from "fs";
import path from "path";
import Ajv from "ajv";
import { getSchemaForSymbol } from "../utils/generate_schemas";

describe.each(
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "../nyt/state.json"), "utf8")
  ).map(({ url, state }: any) => [url, state]) as [string, any][]
)("state validation tests for %s", (url, state) => {
  let validate: Ajv.ValidateFunction;

  beforeAll(() => {
    const ajv = new Ajv();
    validate = ajv.compile(getSchemaForSymbol("NYTState"));

    expect.extend({
      toValidate: val => ({
        pass: val,
        message: () => JSON.stringify(validate.errors)
      })
    });
  });

  test("passes class validator", () => {
    return (expect(validate(state)) as any).toValidate();
  });
});
