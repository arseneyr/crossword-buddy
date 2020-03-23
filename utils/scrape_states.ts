import "reflect-metadata";
import path from "path";
import fs from "fs";

import puppeteer from "puppeteer-extra";

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
import { Browser } from "puppeteer";

async function downloadStuff(
  browser: Browser,
  year: string,
  month: string,
  day: string
) {
  let resolveWithState: any = null;
  let statePromise = new Promise<any>(resolve => (resolveWithState = resolve));
  const page = await browser.newPage();
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
        event.data.type === "INITIAL_STATE" &&
        (window as any)["handleMessage"](event.data),
      false
    )
  );
  const url = `https://www.nytimes.com/crosswords/game/daily/${year}/${month}/${day}`;
  await page.goto(url);
  const state = await statePromise;
  await page.close();
  return { url, state };
}

const ITERATIONS = 400;

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: path.resolve(__dirname, "../.vscode/ChromeData")
  });
  const today = new Date();
  const results = await Array.from(Array(ITERATIONS).keys())
    .map(i => {
      const d = new Date();
      d.setDate(today.getDate() - i);
      return [
        d.getFullYear().toString(),
        (d.getMonth() + 1).toString().padStart(2, "0"),
        d
          .getDate()
          .toString()
          .padStart(2, "0")
      ];
    })
    .reduce(
      (chain, [y, m, d]) =>
        chain.then(results =>
          downloadStuff(browser, y, m, d).then(r => [...results, r])
        ),
      Promise.resolve([])
    );
  fs.writeFileSync(
    path.resolve(__dirname, "../nyt/state.json"),
    JSON.stringify(results, null, 2)
  );
  await browser.close();
}

run();
