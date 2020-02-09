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
  host: "127.0.0.1",
  transportMode: "ws"
};

if (config.entry.content) {
  config.entry.content = path.resolve(__dirname, "../src/js/hmr.js");
}

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, wdsConfig);

server.listen(env.PORT);
