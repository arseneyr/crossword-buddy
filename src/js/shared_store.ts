import {
  createAction,
  createStore,
  Store,
  Reducer,
  Middleware,
  applyMiddleware,
  compose,
  StoreEnhancer,
  Unsubscribe,
  AnyAction,
  Action,
  createSlice,
  combineReducers,
  ReducersMapObject
} from "@reduxjs/toolkit";
import Automerge, { Doc, Diff, Connection, DocSet } from "automerge";
import { NYTState, CellType } from "./protocol/types";
import { Dispatch } from "react";

interface SharedStateInternal extends NYTState {
  html: string;
  gameFonts: string;
  gameFontsVersion: number;
  otherStyles: string;
  clientFontsVersion: number;
  veiled: boolean;
}

export type SharedState = Partial<SharedStateInternal>;
export type State = { shared: SharedState | null };

// Actions

export const addSharedState = createAction<SharedState, "ADD_SHARED_STATE">(
  "ADD_SHARED_STATE"
);
export const resetSharedState = createAction<SharedState>("RESET_SHARED_STATE");

const peerChannelOpened = createAction<
  {
    send: (msg: any) => void;
    receive: (receive: (msg: any) => void) => void;
  },
  "PEER_CHANNEL_OPENED"
>("PEER_CHANNEL_OPENED");

const peerChannelClosed = createAction("PEER_CHANNEL_CLOSED");
const sharedStateReceived = createAction<SharedState, "@SHARED_STATE_RECEIVED">(
  "@SHARED_STATE_RECEIVED"
);

type PrivateActions = ReturnType<typeof sharedStateReceived>;
type PublicActions = ReturnType<typeof addSharedState>;

export type ChangeHandler = (change: Diff, state: Doc<SharedState>) => void;

export default class SyncStore<
  AdditionalState = {},
  A extends Action<string> = AnyAction
> implements Store<State & AdditionalState, A | PublicActions> {
  private readonly store: Store<
    State & AdditionalState,
    A | PrivateActions | PublicActions
  >;

  private readonly docSet: DocSet<SharedState> = new DocSet();
  private static readonly DOC_ID = "shared-doc";
  private connection: Connection<SharedState> | null = null;
  private synchronizerUnsubscribe: Unsubscribe | null = null;

  private readonly changeHandlers: ChangeHandler[] = [];
  private changeHandlerUnsubscribe: Unsubscribe | null = null;
  private currentSharedState: Doc<SharedState> | null = null;

  constructor(additionalReducers?: ReducersMapObject<AdditionalState, A>) {
    this.store = createStore(
      combineReducers({ ...(additionalReducers || {}), shared: this.reducer })
    );

    this.synchronizerUnsubscribe = this.store.subscribe(() => {
      const { shared } = this.store.getState();
      shared && this.docSet.setDoc(SyncStore.DOC_ID, shared);
    });
  }

  private reducer: Reducer<
    Doc<SharedState> | null,
    PrivateActions | PublicActions
  > = (shared = null, action) => {
    switch (action.type) {
      case addSharedState.type:
        return Automerge.change(shared || Automerge.from({}), doc => {
          Object.assign(doc, action.payload);
        });

      case sharedStateReceived.type:
        return action.payload || null;
    }
    return shared;
  };

  peerConnected(send: (msg: any) => void) {
    this.connection = new Automerge.Connection(this.docSet, send);

    this.connection.open();
  }

  messageReceived(msg: any) {
    this.store.dispatch(sharedStateReceived(this.connection!.receiveMsg(msg)));
  }

  peerDisconnected() {
    this.connection && this.connection.close();
    this.connection = null;
    this.changeHandlerUnsubscribe && this.changeHandlerUnsubscribe();
    this.changeHandlerUnsubscribe = null;
    return;
  }

  registerChangeHandler(handler: ChangeHandler) {
    if (!this.changeHandlerUnsubscribe) {
      this.changeHandlerUnsubscribe = this.store.subscribe(() => {
        const newSharedState = this.store.getState().shared;
        if (newSharedState) {
          const changes = Automerge.diff(
            this.currentSharedState || Automerge.init(),
            newSharedState
          );
          this.currentSharedState = newSharedState;
          changes.forEach(c =>
            this.changeHandlers.forEach(h => h(c, newSharedState))
          );
        }
      });
    }

    this.changeHandlers.push(handler);
  }

  // Reexport store interface

  getState() {
    return this.store.getState();
  }

  dispatch<T extends A | PublicActions>(action: T) {
    return this.store.dispatch(action);
  }

  replaceReducer(nextReducer: Reducer<State & AdditionalState, A>) {
    throw new Error("Unimplemented!"); //return this.store.replaceReducer(nextReducer);
  }

  subscribe(handler: () => void) {
    return this.store.subscribe(handler);
  }

  [Symbol.observable]() {
    return this.store[Symbol.observable]();
  }
}
/*
function newStore(
  additionalReducer?: Reducer,
  initialState?: SharedState
): Store {
  const docSet = new Automerge.DocSet<SharedState>();
  const sharedStateReceived = createAction<SharedState>(
    "@SHARED_STATE_RECEIVED"
  );

  const reducer: Reducer<State> = (state = { shared: null }, action) => {
    switch (action.type) {
      case addSharedState.type:
        return {
          ...state,
          shared: Automerge.change(state?.shared || Automerge.from({}), doc => {
            Object.assign(doc, action.payload);
          })
        };

      case sharedStateReceived.type:
        return { ...state, shared: action.payload };
    }
    return state;
  };

  let unsubscribe: Unsubscribe | null = null;
  let connection: Connection<SharedState> | null = null;

  const middleware: Middleware = store => next => action => {
    if (action.type === peerChannelOpened.type) {
      //debugger;
      const { send, receive } = action.payload;
      connection = new Automerge.Connection(docSet, send);
      receive((data: any) =>
        store.dispatch(sharedStateReceived(connection!.receiveMsg(data)))
      );
      connection.open();
      return;
    } else if (action.type === peerChannelClosed.type) {
      unsubscribe && unsubscribe();
      unsubscribe = null;
      connection && connection.close();
      connection = null;
      return;
    }
    return next(action);
  };

  const store = createStore(reducer, applyMiddleware(middleware));
  unsubscribe = store.subscribe(() => {
    const { shared } = store.getState();
    if (shared) {
      docSet.setDoc("test-doc", shared);
    }
  });
  //store.changeHandlers = [];
  return store;
}
*/
//export default newStore;

function addChangeHandler(
  store: any,
  handler: (change: Diff, state: SharedState) => void
) {
  if (!(store as any).handlers) {
    store.handlers = [handler];
    (function() {
      let curSharedState = store.getState().shared;
      store.subscribe(() => {
        const newSharedState = store.getState().shared;
        if (newSharedState) {
          const changes = Automerge.diff(
            curSharedState || Automerge.init(),
            newSharedState
          );
          curSharedState = newSharedState;
          console.log(changes);
          changes.forEach(c =>
            store.handlers.forEach((h: any) => h(c, newSharedState))
          );
        }
      });
    })();
  } else {
    store.handlers.push(handler);
  }
}

/*
//const cellClick = createAction("cellClick");

/*const reducer = createReducer({}, builder => builder.addCase(cellClick, (state, action) => {

}));

interface StateShape {
  clientSelection: {
    clue: number;

    cell: number;
  };

  board?: NYTState;
}

export const stateReceived = createAction<Change[]>("stateReceived");
const cellSelection = createAction<number>("cellSelection");

const autoMergeEnhancer: (
  sendMsg: (msg: any) => void
) => StoreEnhancer = sendMsg => createStore => (reducer, initialState) => {
  const newReducer: typeof reducer = (state, action) => {
    const newState = reducer(state, action);
    if (action.type !== stateReceived.type) {
      const changes = Automerge.getChanges(state || Automerge.init(), newState);
      changes.length && sendMsg(changes);
    }
    return newState;
  };

  return createStore(newReducer, initialState);
};
const reducer = (state: State | undefined, action: any) => {
  if (!state) {
    return Automerge.from<StateShape>({
      clientSelection: { clue: 0, cell: 0 }
    });
  }

  switch (action.type) {
    case cellSelection.type: {
      if (!state.board) {
        return state;
      }
      const newCell = action.payload;
      const { cells, clues } = state.board;
      if (cells[newCell].type === CellType.BLACK) {
        return state;
      }
      return Automerge.change(state, s => {
        s.clientSelection.cell = newCell;
        const oldDirection = clues[s.clientSelection.clue].list;
        const possibleClues = cells[newCell].clues;
        s.clientSelection.clue =
          oldDirection < possibleClues.length
            ? possibleClues[oldDirection]
            : possibleClues[0];
      });
    }
    case stateReceived.type:
      return Automerge.applyChanges<StateShape>(
        state || Automerge.init(),
        action.payload
      );
  }

  return state;
};

function cs1(sendMsg: (msg: any) => void) {
  return configureStore({ reducer, enhancers: [autoMergeEnhancer(sendMsg)] });
}*/
