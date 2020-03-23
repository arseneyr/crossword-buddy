import Peer from "peerjs";

function createPeer() {
  const url = new URL(process.env.PEERJS_SERVER!);
  const peerJsServer = url
    ? {
        host: url.hostname,
        secure: url.protocol === "https:",
        port: url.port
          ? parseInt(url.port)
          : url.protocol === "https:"
          ? 443
          : 80,
        path: url.pathname
      }
    : {};
  return new Peer({
    debug: process.env.NODE_ENV === "development" ? 3 : undefined,
    ...peerJsServer
  });
}

export { createPeer };
