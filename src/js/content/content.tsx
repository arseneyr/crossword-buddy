import "react-hot-loader";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import newStore, { initializeSharedState } from "../store";
import protocol from "./injected_protocol";
import { MessageValidator } from "../validator";
import schema from "../__schemas__/InitialMessage.schema.json";
import { InitialMessage } from "../protocol/types";
import { getInitialHtml, getOtherStyles } from "./parse_page";

const store = newStore();

protocol.INITIAL_STATE.handle(state => {
  const initialState = {
    ...state,
    gameFonts: JSON.parse(localStorage.getItem("games-fonts")!).d,
    html: getInitialHtml(),
    otherStyles: getOtherStyles()
  };
  new MessageValidator<InitialMessage>(schema).validate(initialState);
  store.dispatch(initializeSharedState(initialState));
});

const s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.bundle.js");
//s.async = false;
document.documentElement.appendChild(s);

window.onload = () => {
  const toolbar = Array.from(
    document.documentElement.querySelectorAll("div")
  ).find(el => el.className.includes("ButtonBar-wrapper--"));

  if (toolbar) {
    document
      .querySelectorAll(".pz-ad-box")
      .forEach(n => n.setAttribute("style", "display:none;"));
    const root = document.createElement("div");
    document.body.append(root);

    render(
      <Provider store={store}>
        <App toolbar={toolbar} />
      </Provider>,
      root
    );
  }
};
