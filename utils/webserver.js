var WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config"),
  env = require("./env"),
  path = require("path");

const wdsConfig = {
  hot: true,
  contentBase: path.join(__dirname, "../build"),
  sockPort: env.PORT,
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
  disableHostCheck: true,
  public: `http://127.0.0.1:${env.PORT}`,
  host: "127.0.0.1"
};

// Remove the content entry point to disable HMR inside it
const content = config.entry.content;
delete config.entry.content;

if (config.entry.background) {
  const background = Array.isArray(config.entry.background)
    ? config.entry.background
    : [config.entry.background];
  background.unshift(path.resolve(__dirname, "../src/js/reloader.js"));
  config.entry.background = background;
}

WebpackDevServer.addDevServerEntrypoints(config, wdsConfig);

config.entry.content = content;
wdsConfig.injectHot = false;
wdsConfig.injectClient = false;

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, wdsConfig);

server.listen(env.PORT);
