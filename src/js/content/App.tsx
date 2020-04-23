import "react-hot-loader";
import { hot } from "react-hot-loader/root";
import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { createPeer } from "../peerjs";
import { useSelector, useStore } from "react-redux";
import SyncStore, {
  State,
  addSharedState
  //addChangeHandler
} from "../shared_store";
import { Store } from "@reduxjs/toolkit";
import { getInitialHtml, getOtherStyles } from "./parse_page";

function startConnection(store: SyncStore) {
  const { version, d } = JSON.parse(localStorage.getItem("games-fonts")!);
  store.dispatch(
    addSharedState({
      gameFontsVersion: version,
      html: getInitialHtml()
    })
  );
  //store.subscribe(() => console.log(store.getState()));

  store.registerChangeHandler(({ action, key, value }) => {
    if (action === "set" && key === "clientFontsVersion") {
      if (value < version) {
        store.dispatch(addSharedState({ gameFonts: d }));
      }
    }
  });

  const peer = createPeer();
  peer.on("connection", conn => {
    conn.on("open", () => {
      conn.on("data", data => store.messageReceived(data));
      conn.on("close", () => store.peerDisconnected());
      store.peerConnected(msg => conn.send(msg));

      console.log("Connected");
    });
  });
  peer.on("open", id => {
    chrome.runtime.sendMessage({ type: "spawn", id });
  });
}

const Button = ({ toolbar }: { toolbar: HTMLDivElement }) => {
  const ready = useSelector<State>(({ shared }) => Boolean(shared));
  const store: SyncStore = useStore() as any;
  const onClick = useCallback(() => {
    if (!ready) return;
    startConnection(store);
  }, [ready, store]);
  return createPortal(
    <button
      className={
        toolbar.firstChild
          ? (toolbar.firstChild as HTMLElement).className
          : undefined
      }
      onClick={onClick}
    >
      {ready ? "Invite Friends" : "Loading"}
    </button>,
    toolbar
  );
};

export default hot(Button);
