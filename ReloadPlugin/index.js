const path = require("path"),
  fs = require("fs-extra"),
  ContentScriptHandler = require("./contentHandler");

class ReloadPlugin {
  constructor(opts) {
    this.opts = Object.assign(
      {
        manifest: "manifest.json",
        contentScripts: [],
        backgroundScript: null
      },
      opts || {}
    );

    this.contentScriptHandler = new ContentScriptHandler(
      this.opts.contentScripts,
      this.opts.backgroundScript
    );
  }

  apply(compiler) {
    this.contentScriptHandler.apply(compiler);
    compiler.hooks.compile.tap("ReloadPlugin", () => {
      compiler.options.entry.injected = path.resolve(
        __dirname,
        "../src/js/content/injected.ts"
      );
      compiler.hooks.entryOption.call(
        compiler.options.context,
        compiler.options.entry
      );
    });
  }
}

module.exports = ReloadPlugin;
