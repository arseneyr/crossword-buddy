interface MessageValidator<T> {
  validate(data: any): T;
}

export interface ProtocolDescription {
  [messageType: string]: MessageValidator<any> | false | null;
}

type Handler<T> = T extends null
  ? () => void
  : T extends false
  ? (payload: any) => void
  : T extends MessageValidator<infer R>
  ? (payload: R) => void
  : never;

type MessageTable<T extends ProtocolDescription> = {
  [P in keyof T]: {
    handle: (handler: Handler<T[P]>, once?: boolean) => void;

    send: Handler<T[P]>;
  };
};

type CustomEvent<
  T extends ProtocolDescription[keyof ProtocolDescription]
> = T extends MessageValidator<infer R>
  ? Event & { payload: R }
  : T extends false
  ? Event & { payload: any }
  : Event;

export default function generateProtocol<T extends ProtocolDescription>(
  validators: T,
  sendFunction: (payload: any) => void,
  receiveFunction: (handler: (payload: any) => void) => void
): MessageTable<typeof validators> {
  const eventTarget = new EventTarget();

  const receiveHandler = (message: any) => {
    if (!message.type || !Object.keys(validators).includes(message.type)) {
      console.error(`Invalid message received`);
      console.error(message);
    }
    try {
      const validator = validators[message.type];
      const event = new Event(message.type);
      if (validator !== null) {
        if (!message.payload) {
          throw new Error("No payload found");
        }
        if (validator === false) {
          (event as CustomEvent<typeof validator>).payload = message.payload;
        } else {
          (event as CustomEvent<typeof validator>).payload = validator.validate(
            message.payload
          );
        }
      }

      eventTarget.dispatchEvent(event);
    } catch (e) {
      console.error(`Message payload failed validation`);
      console.error(message);
    }
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
      handle: (handler: Handler<typeof validator>, once = false) => {
        eventTarget.addEventListener(
          type,
          (event => {
            if (validator === null) {
              (handler as Handler<typeof validator>)();
            } else {
              handler((event as CustomEvent<typeof validator>).payload);
            }
          }) as EventListener,
          { once }
        );
      },
      send: (payload: any) => {
        sendFunction({ type, payload: Object.assign({}, payload) });
      }
    };
  }

  return ret;
}
