import "react-hot-loader";
import React from "react";
import { render } from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

const s = document.createElement("script");
s.src = chrome.runtime.getURL("injected.bundle.js");
s.async = false;
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
