import "react-hot-loader";
import { hot } from "react-hot-loader/root";
import React, { useCallback } from "react";
import { createPortal } from "react-dom";
import { createPeer } from "../peerjs";
import { useSelector } from "react-redux";
import store, { State } from "./store";
import generateProtocol from "../protocol_generator";
import generateMainProtocol, { InitialStateMessage } from "../main_protocol";

function getInitialState() {
  /*const clone = document.getElementById("root").cloneNode(true);
  const board = clone.querySelector(".layout");
  let curNode = clone;
  while (curNode !== board) {
    if (curNode.childNodes.length > 1) {
      Array.from(curNode.childNodes).forEach(
        n => n.contains(board) || n.remove()
      );
    }
    curNode = curNode.firstChild;
  }

  board.firstChild.remove();
  board.lastChild.remove();
  board.querySelector("div[style ^= PuzzleHeader-toolsContainer--]").remove();
  //document.querySelector("div.layout");
  return {
    board: document.querySelector("div.layout").outerHTML,
    styles: Array.prototype.map.call(
      document.getElementsByTagName("style"),
      n => n.innerHTML
    )
  };*/
}

function startConnection() {
  const peer = createPeer();
  peer.on("connection", conn => {
    const protocolTable = generateMainProtocol(conn);

    console.log("Connected");
    protocolTable.ACK.handle(() => {
      const initialStateMessage = new InitialStateMessage();
      initialStateMessage.styles = Array.prototype.map.call(
        document.getElementsByTagName("style"),
        n => n.innerHTML
      ) as string[];
      initialStateMessage.initialState = store.getState().nytState!;
      protocolTable.INITIAL_STATE.send(initialStateMessage);
    });
    conn.on("open", () => protocolTable.INIT.send());
  });
  peer.on("open", id => {
    chrome.runtime.sendMessage({ type: "spawn", id });
  });
}

const Button = ({ toolbar }: { toolbar: HTMLDivElement }) => {
  const ready = useSelector<State>(({ nytState }) => nytState !== null);
  const onClick = useCallback(() => {
    if (!ready) return;
    startConnection();
  }, [ready]);
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
