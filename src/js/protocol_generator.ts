import "reflect-metadata";
import { ClassType } from "class-transformer/ClassTransformer";
import { transformAndValidateSync } from "class-transformer-validator";

interface ProtocolDescription {
  [messageType: string]: ClassType<any> | null;
}

type ClassTypeResult<T> = T extends ClassType<infer R> ? R : never;

type Handler<T> = T extends null
  ? () => void
  : T extends ClassType<infer R>
  ? (payload: R) => void
  : never;

type MessageTable<T extends ProtocolDescription> = {
  [P in keyof T]: {
    handle: (handler: Handler<T[P]>) => void;

    send: Handler<T[P]>;
  };
};

const p = { fff: Error };
const m: MessageTable<typeof p> = {
  fff: {
    handle: f => {
      f(new Error());
    },
    send: () => {}
  }
};

type CustomEvent<
  T extends ProtocolDescription[keyof ProtocolDescription]
> = T extends ClassType<infer R> ? Event & { payload: R } : Event;

export default function generateProtocol<T extends ProtocolDescription>(
  validators: T,
  sendFunction: (payload: any) => void,
  receiveFunction: (handler: (payload: any) => void) => void
): MessageTable<typeof validators> {
  const eventTarget = new EventTarget();

  const receiveHandler = (message: any) => {
    debugger;
    if (!message.type || !Object.keys(validators).includes(message.type)) {
      console.error(`Invalid message received`);
      console.error(message);
    }
    const validator = validators[message.type];
    const event = new Event(message.type);
    if (validator) {
      try {
        if (!message.payload) {
          throw new Error("No payload found");
        }
        (event as CustomEvent<
          typeof validator
        >).payload = transformAndValidateSync(validator, message.payload, {
          validator: { whitelist: true }
        });
      } catch (e) {
        console.error(`Message payload failed validation`);
        console.error(message);
      }
    }

    eventTarget.dispatchEvent(event);
  };

  receiveFunction(receiveHandler);

  const ret = {} as MessageTable<typeof validators>;

  /*return Object.fromEntries(
    Object.entries(validators).map(([type, validator]) => [
      type,
      {
        handle: (handler: Handler<typeof validator>) => {
          eventTarget.addEventListener(
            type,
            ((event: CustomEvent<typeof validator>) => {
              if (validator === null) {
                (handler as Handler<typeof validator>)();
              } else {
                handler((event as CustomEvent<typeof validator>).payload);
              }
            }) as EventListener,
            false
          );
        },
        send: (payload: typeof validator) => {
          sendFunction({ type, payload: Object.assign({}, payload) });
        }
      }
    ])
  );*/

  for (const type of Object.keys(validators)) {
    const validator = validators[type];
    (ret as any)[type] = {
      handle: (handler: Handler<typeof validator>) => {
        eventTarget.addEventListener(
          type,
          (event => {
            if (validator === null) {
              (handler as Handler<typeof validator>)();
            } else {
              handler((event as CustomEvent<typeof validator>).payload);
            }
          }) as EventListener,
          false
        );
      },
      send: (payload: ClassTypeResult<typeof validator>) => {
        sendFunction({ type, payload: Object.assign({}, payload) });
      }
    };
  }

  return ret;
}
