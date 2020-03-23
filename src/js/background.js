chrome.runtime.onMessage.addListener(
  request =>
    request.type &&
    request.type === "spawn" &&
    chrome.tabs.create({ url: "/client.html" }, ({ id }) =>
      chrome.runtime.onConnect.addListener(() =>
        chrome.tabs.sendMessage(id, request.id)
      )
    )
);
