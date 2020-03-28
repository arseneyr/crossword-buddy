import "react-hot-loader";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import newStore, { addSharedState } from "../shared_store";
import protocol from "./injected_protocol";
import { MessageValidator } from "../validator";
import schema from "../__schemas__/StateValidate.schema.json";
import { NYTState } from "../protocol/types";
import { getOtherStyles } from "./parse_page";
import SyncStore from "../shared_store";

const store = new SyncStore();

protocol.INITIAL_STATE.handle(state => {
  new MessageValidator<NYTState>(schema).validate(state);

  // getOtherStyles needs to run here and NOT in a user event callback (for some reason)
  store.dispatch(
    addSharedState({ ...state, veiled: true, otherStyles: getOtherStyles() })
  );
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
