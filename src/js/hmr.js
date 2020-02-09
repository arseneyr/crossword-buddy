require("./content");

let appendChild = null;

function patchScriptAddition() {
  appendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(script) {
    Node.prototype.appendChild = appendChild;
    appendChild = null;
    fetch(script.src)
      .then(res => res.text())
      .then(eval);
  };
}

if (module.hot) {
  module.hot.addStatusHandler(status => {
    if (status === "prepare") {
      patchScriptAddition();
    }
  });

  module.hot.accept("./content", () => require("./content"));
}
