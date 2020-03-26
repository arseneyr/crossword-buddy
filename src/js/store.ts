import {
  createAction,
  createStore,
  Store,
  Reducer,
  Middleware,
  applyMiddleware
} from "@reduxjs/toolkit";
import Automerge, { Doc } from "automerge";
import { NYTState, CellType } from "./protocol/types";

interface SharedState extends Partial<NYTState> {
  html?: string;
  gameFonts?: string;
  otherStyles?: string;
  clientFontVersion?: number;
}
export const initializeSharedState = createAction<SharedState>(
  "INITIALIZE_SHARED_STATE"
);

export const peerChannelOpened = createAction<{
  send: (msg: any) => void;
  receive: (receive: (msg: any) => void) => void;
}>("PEER_CHANNEL_OPENED");

export interface State {
  shared: Doc<SharedState> | undefined;
}

function newStore(): Store {
  const docSet = new Automerge.DocSet<SharedState>();
  const sharedStateReceived = createAction<SharedState>(
    "@SHARED_STATE_RECEIVED"
  );

  const reducer: Reducer<State> = (state = { shared: undefined }, action) => {
    switch (action.type) {
      case initializeSharedState.type:
        if (state.shared) {
          console.error("DOUBLE INIT SHARED STATE!");
          return state;
        }
        return { ...state, shared: Automerge.from(action.payload) };

      case sharedStateReceived.type:
        return { ...state, shared: action.payload };
    }
    return state;
  };

  let inMiddleware = false;

  const middleware: Middleware = store => next => action => {
    if (action.type === peerChannelOpened.type) {
      const { send, receive } = action.payload;
      const connection = new Automerge.Connection(docSet, send);
      receive((data: any) => connection.receiveMsg(data));
      connection.open();
      return;
    }
    const ret = next(action);
    const { shared } = store.getState();
    if (shared && docSet.getDoc("test-doc") !== shared) {
      inMiddleware = true;
      docSet.setDoc("test-doc", shared);
      inMiddleware = false;
    }
    return ret;
  };

  const store = createStore(reducer, applyMiddleware(middleware));

  docSet.registerHandler((_, doc) => {
    !inMiddleware && store.dispatch(sharedStateReceived(doc));
  });
  return store as any;
}

export default newStore;

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
