import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";
import protocol from "./injected_protocol";
import InitialState from "../validator";

const setInitialState = createAction<InitialState>("setInitialState");

export interface State {
  nytState: InitialState | null;
}

const reducer = createReducer<State>({ nytState: null }, builder =>
  builder.addCase(setInitialState, (state, action) => {
    state.nytState = action.payload.toPlainObj();
  })
);

const store = configureStore({
  reducer
});

protocol.INITIAL_STATE.handle(state => {
  store.dispatch(setInitialState(state));
  debugger;
});

export { setInitialState };

export default store;
