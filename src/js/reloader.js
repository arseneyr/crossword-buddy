var SockJS = require("sockjs-client");
var url = require("url");

// Connect to WebpackDevServer via a socket.
var connection = new SockJS(
  url.format({
    // Default values - Updated to your own
    protocol: "http",
    hostname: "127.0.0.1",
    port: "3000",
    // Hardcoded in WebpackDevServer
    pathname: "/sockjs-node"
  })
);

var isFirstCompilation = true;
var mostRecentCompilationHash = null;

connection.onmessage = function(e) {
  var message = JSON.parse(e.data);
  switch (message.type) {
    case "hash":
      handleAvailableHash(message.data);
      break;
    case "still-ok":
    case "ok":
    case "content-changed":
    case "warnings":
      handleSuccess();
      break;
    default:
    // Do nothing.
  }
};

// Is there a newer version of this code available?
function isUpdateAvailable() {
  /* globals __webpack_hash__ */
  // __webpack_hash__ is the hash of the current compilation.
  // It's a global variable injected by Webpack.
  return mostRecentCompilationHash !== __webpack_hash__;
}

function handleAvailableHash(data) {
  mostRecentCompilationHash = data;
}

function handleSuccess() {
  console.log("YOOOOOs");
  var isHotUpdate = !isFirstCompilation;
  isFirstCompilation = false;

  if (isHotUpdate) {
    handleUpdates();
  }
}

function handleUpdates() {
  if (!isUpdateAvailable()) return;
  console.log("%c Reloading Extension", "color: #FF00FF");
  chrome.runtime.reload();
}
