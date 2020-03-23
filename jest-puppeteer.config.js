const path = require("path");

module.exports = {
  launch: {
    userDataDir: path.resolve(__dirname, "./.vscode/ChromeData"),
    headless: false
  }
};
