import StateValidator from "./validator";
import { Type } from "class-transformer";
import { ValidateNested, IsDefined, IsString, IsArray } from "class-validator";
import { DataConnection } from "peerjs";
import generateProtocol from "./protocol_generator";

export class InitialStateMessage {
  @IsString({ each: true })
  @IsArray()
  styles!: string[];

  @ValidateNested()
  @IsDefined()
  @Type(() => StateValidator)
  initialState!: StateValidator;
}

const validators = {
  INIT: null,
  ACK: null,
  INITIAL_STATE: InitialStateMessage
};

export default function generateMainProtocol(conn: DataConnection) {
  return generateProtocol(validators, conn.send.bind(conn), handler =>
    conn.on("data", handler)
  );
}
