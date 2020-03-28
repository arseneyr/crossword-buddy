import "../../css/client.css";
import { createPeer } from "../peerjs";
import Peer from "peerjs";
import newStore, { addSharedState, State, SharedState } from "../shared_store";
import Automerge, { Diff } from "automerge";
import SyncStore from "../shared_store";

function initChangeHandler({ action, key, value }: Diff, state: SharedState) {
  if (action !== "set") return;
  if (key === "otherStyles" || key === "gameFonts") {
    const e = document.createElement("style");
    e.innerHTML = value;
    document.head.appendChild(e);
    if (key === "gameFonts") {
      localStorage.setItem("games-fonts", value);
      localStorage.setItem(
        "clientFontsVersion",
        JSON.stringify(state.gameFontsVersion)
      );
    }
  } else if (key === "html") {
    const boardEl = document.createElement("div");
    document.getElementById("root")!.appendChild(boardEl);
    boardEl.outerHTML = value;
  }
}

function start(conn: Peer.DataConnection) {
  const store = new SyncStore();
  conn.on("open", () => {
    conn.on("data", data => store.messageReceived(data));
    conn.on("close", () => store.peerDisconnected());
    store.peerConnected(msg => conn.send(msg));
  });

  store.registerChangeHandler(initChangeHandler);
  store.registerChangeHandler(({ action, key, value }, state) => {
    if (action === "set" && key === "gameFontsVersion") {
      //debugger;
      const clientFontsVersion = JSON.parse(
        localStorage.getItem("clientFontsVersion") || "0"
      );
      if (clientFontsVersion >= value) {
        const fonts = localStorage.getItem("games-fonts");
        if (fonts) {
          const e = document.createElement("style");
          e.innerHTML = fonts;
          document.head.appendChild(e);
          return;
        }
      }
      store.dispatch(addSharedState({ clientFontsVersion }));
    }
  });

  /*let curSharedState = store.getState().shared;

  store.subscribe(() => {
    const newSharedState = store.getState().shared;
    if (curSharedState) {
      const changes = Automerge.diff(curSharedState, newSharedState);
      changes.forEach(c => changeHandlers.forEach(h => h(c)));
      console.log(changes);
    }
    curSharedState = newSharedState;
  });*/
}

chrome.runtime.onMessage.addListener(id => {
  console.log("id" + id);
  const peer = createPeer();
  peer.on("open", () => {
    console.log("opened");
    const conn = peer.connect(id, { reliable: true });
    start(conn);
  });
});

chrome.runtime.connect();
