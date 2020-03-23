import "reflect-metadata";
import "expect-puppeteer";
import path from "path";
import fs from "fs";
import Validator from "../src/js/validator";
import { transformAndValidate } from "class-transformer-validator";

var util = require("util");
util.inspect.defaultOptions.depth = null;

const ITERATIONS = 50;

const today = new Date();
const table = Array.from(Array(ITERATIONS).keys()).map(i => {
  const d = new Date();
  d.setDate(today.getDate() - i);
  return [
    d.getFullYear(),
    (d.getMonth() + 1).toString().padStart(2, "0"),
    d
      .getDate()
      .toString()
      .padStart(2, "0")
  ];
});

jest.setTimeout(30000);

describe.skip.each(table)("Crossword for %s/%s/%s", (year, month, day) => {
  //const date = new Date();
  let resolveWithState: any = null;
  let statePromise = new Promise<any>(resolve => (resolveWithState = resolve));
  /*beforeAll(async () => {
    const url = `https://www.nytimes.com/crosswords/game/daily/${year}/${month}/${day}`;

    await page.evaluateOnNewDocument(
      fs.readFileSync(
        path.resolve(__dirname, "../build/injected.bundle.js"),
        "utf8"
      )
    );
    await page.exposeFunction("handleMessage", ({ payload }) => {
      resolveWithState(payload);
    });
    await page.evaluateOnNewDocument(() =>
      window.addEventListener(
        "message",
        event =>
          event.source === window &&
          event.data.source === "cro-bud" &&
          (window as any)["handleMessage"](event.data),
        false
      )
    );
    await page.goto(url, { waitUntil: "domcontentloaded" });
  });

  afterAll(async () => {
    await jestPuppeteer.resetPage();
  });*/

  test("loads?", async () => {
    const state = await statePromise;
    return expect(
      transformAndValidate(Validator, state, {
        validator: { whitelist: true }
      }).catch(e => {
        console.error(`${year}/${month}/${day}`);
        console.error(e.toString());
        throw e;
      })
    ).resolves.toBeDefined();
  });
});
