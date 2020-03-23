import protocol from "./injected_protocol";
console.log("SCRIPT INJECTED!");

let originalEnhancer =
  (window as any).devToolsExtension ||
  (() => (createStore: any) => (...args: any[]) => createStore(...args));
Object.defineProperty(window, "devToolsExtension", {
  get() {
    return () => {
      return (createStore: any) => reduxHook(originalEnhancer()(createStore));
    };
  },
  set(x) {
    originalEnhancer = x;
  }
});

const reduxHook = (createStore: any) => (...args: any[]) => {
  //debugger;
  const store = createStore(...args);

  const dispatch = (action: any, ...args: any[]) => {
    console.log(action);
    if (action.type === "PUZZLE_SYNCED") {
      const res = store.dispatch(action, ...args);
      protocol["INITIAL_STATE"].send(store.getState().gamePageData);
      return res;
    }
    //window.postMessage(action, "*");
    return store.dispatch(action, ...args);
  };

  return {
    ...store,
    dispatch
  };
};
