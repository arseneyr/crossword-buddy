import State from "../validator";
import generateProtocol from "../protocol_generator";

const source = "cro-bud";
/*
const validators = {
  INITIAL_STATE: State
};

interface MessageInterface<T> {
  handle: (handler: (payload: T) => void) => void;
  send: (payload: T) => void;
}

interface MessageTable {
  INITIAL_STATE: MessageInterface<typeof State>;
}

type CustomEvent<T> = Event & {
  payload: T;
};

const eventTarget = new EventTarget();

window.addEventListener(
  "message",
  function(event) {
    // We only accept messages from ourselves
    if (
      event.source != window ||
      event.data.source !== source ||
      ! .includes(event.data.type)
    ) {
      return;
    }

    const newEvent = new Event(event.data.type) as CustomEvent<any>;
    newEvent.payload = event.data.payload;
    eventTarget.dispatchEvent(newEvent);

    console.log(event.data);
  },
  false
);

const handlers: MessageTable = Object.fromEntries(
  Object.entries(validators).map(([type, validator]) => [
    type,
    {
      handle: handler => {
        eventTarget.addEventListener(
          type,
          (({ payload }: CustomEvent<any>) =>
            handler(payload)) as EventListener,
          {
            passive: true
          }
        );
        return () => eventTarget.removeEventListener(type, handler);
      },
      send: payload => {
        window.postMessage({ type, source, payload }, "*");
      }
    }
  ])
);*/

const validators = {
  INITIAL_STATE: State
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
