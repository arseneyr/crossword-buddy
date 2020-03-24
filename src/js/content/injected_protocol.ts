import generateProtocol, { ProtocolDescription } from "../protocol_generator";

const source = "cro-bud";
const validators: ProtocolDescription = {
  INITIAL_STATE: false
};

const protocolTable = generateProtocol(
  validators,
  payload => window.postMessage({ ...payload, source }, "*"),
  handler => {
    window.addEventListener(
      "message",
      event => {
        if (event.source != window || event.data.source !== source) {
          return;
        }
        handler(event.data);
      },
      false
    );
  }
);

export default protocolTable;
