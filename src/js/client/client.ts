import "../../css/client.css";
import { createPeer } from "../peerjs";
import Peer from "peerjs";
import newStore, { peerChannelOpened, initializeSharedState } from "../store";
import Automerge, { change } from "automerge";

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

const changeHandlers: ((change: Automerge.Diff) => void)[] = [];

changeHandlers.push(({ action, key, value }) => {
  if (action !== "set") return;
  if (key === "otherStyles" || key === "gameFonts") {
    const e = document.createElement("style");
    e.innerHTML = value;
    document.head.appendChild(e);
  } else if (key === "html") {
    const boardEl = document.createElement("div");
    document.getElementById("root")!.appendChild(boardEl);
    boardEl.outerHTML = value;
  }
});

function start(conn: Peer.DataConnection) {
  const store = newStore();
  store.dispatch(initializeSharedState({ clientFontVersion: 0 }));
  conn.on("open", () =>
    store.dispatch(
      peerChannelOpened({
        send: msg => conn.send(msg),
        receive: handler => conn.on("data", handler)
      })
    )
  );

  let curSharedState = store.getState().shared;

  store.subscribe(() => {
    const newSharedState = store.getState().shared;
    if (curSharedState) {
      const changes = Automerge.diff(curSharedState, newSharedState);
      changes.forEach(c => changeHandlers.forEach(h => h(c)));
      console.log(changes);
    }
    curSharedState = newSharedState;
  });
}

chrome.runtime.onMessage.addListener(id => {
  console.log("id" + id);
  const peer = createPeer();
  peer.on("open", () => {
    console.log("opened");
    const conn = peer.connect(id, { reliable: true });
    start(conn);

    /*const protocolTable = generateMainProtocol(conn);
    protocolTable.INIT.handle(() => protocolTable.ACK.send());
    protocolTable.INITIAL_STATE.handle(data => {
      const { styles, html } = data;
      styles.forEach((s: string) => {
        const e = document.createElement("style");
        e.innerHTML = s;
        document.head.appendChild(e);
      });
      const boardEl = document.createElement("div");
      document.getElementById("root")!.appendChild(boardEl);
      boardEl.outerHTML = html;
    }, true);*/
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
