import { createAction, createReducer, configureStore } from "@reduxjs/toolkit";
import protocol from "./injected_protocol";
import { TsjsonParser, Validated } from "ts-json-validator";
import { NYTState } from "../protocol/types";

type ValidatedType<T> = T extends TsjsonParser<infer R> ? Validated<R> : never;

const setInitialState = createAction<NYTState>("setInitialState");

export interface State {
  nytState: NYTState | null;
}

const reducer = createReducer<State>({ nytState: null }, builder =>
  builder.addCase(setInitialState, (state, action) => {
    state.nytState = action.payload as any;
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
