import { DataConnection } from "peerjs";
import generateProtocol from "./protocol_generator";
import schema from "./__schemas__/InitialMessage.schema.json";
import { InitialMessage } from "./protocol/types";
import { MessageValidator } from "./validator";

const validators = {
  INIT: null,
  ACK: null,
  INITIAL_STATE: new MessageValidator<InitialMessage>(schema)
};

export default function generateMainProtocol(conn: DataConnection) {
  return generateProtocol(validators, conn.send.bind(conn), handler =>
    conn.on("data", handler)
  );
}
