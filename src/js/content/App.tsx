import "react-hot-loader";
import { hot } from "react-hot-loader/root";
import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { createPeer } from "../peerjs";
import { useSelector, useStore } from "react-redux";
import { peerChannelOpened, State } from "../store";
import { Store } from "@reduxjs/toolkit";

function startConnection(store: Store) {
  store.subscribe(() => console.log(store.getState()));

  const peer = createPeer();
  peer.on("connection", conn => {
    conn.on("open", () =>
      store.dispatch(
        peerChannelOpened({
          send: msg => conn.send(msg),
          receive: handler => conn.on("data", handler)
        })
      )
    );

    console.log("Connected");
  });
  peer.on("open", id => {
    chrome.runtime.sendMessage({ type: "spawn", id });
  });
}

const Button = ({ toolbar }: { toolbar: HTMLDivElement }) => {
  const ready = useSelector<State>(({ shared }) => Boolean(shared));
  const store = useStore();
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
