import "../../css/client.css";
import { createPeer } from "../peerjs";
import store from "./state";
import generateMainProtocol from "../main_protocol";

/*function generateBoard(state) {
  function createElement(obj) {
    const el = document.createElement(obj.name);
    obj.attributes &&
      Object.entries(obj.attributes).forEach(a => el.setAttribute(...a));
    obj.children && obj.children.forEach(c => el.appendChild(createElement(c)));
    return el;
  }

  return createElement(state.board);
}*/

chrome.runtime.onMessage.addListener(id => {
  console.log("id" + id);
  const peer = createPeer();
  peer.on("open", () => {
    console.log("opened");
    const conn = peer.connect(id, { reliable: true });
    const protocolTable = generateMainProtocol(conn);
    protocolTable.INIT.handle(() => protocolTable.ACK.send());
    protocolTable.INITIAL_STATE.handle(console.log);
    /*conn.on("open", () => {
      console.log("Connection established!");
      conn.on("data", data => {
        if (data.type === "init") {
          conn.send({ type: "ack" });
        } else if (data.type === "html") {
          console.log("Received initial data");
          const { board, styles } = data.payload;
          styles.forEach(s => {
            const e = document.createElement("style");
            e.innerHTML = s;
            document.head.appendChild(e);
          });
          const boardEl = document.createElement("div");
          document.getElementById("root").appendChild(boardEl);
          boardEl.outerHTML = board;
        }
      });
    });*/
  });
});

chrome.runtime.connect();
