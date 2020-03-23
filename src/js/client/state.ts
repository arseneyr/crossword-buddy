import {
  createSlice,
  createAction,
  createReducer,
  PayloadAction
} from "@reduxjs/toolkit";

//const cellClick = createAction("cellClick");

/*const reducer = createReducer({}, builder => builder.addCase(cellClick, (state, action) => {

}));*/

type SliceState = {
  cell: number;
  clue: number;
  cellClues: [number, number];
  clueCells: number[];
};

enum CellType {
  BLACK = 0,
  LETTER
}

type CellState = {
  type: CellType;
  clues: [number, number];
  guess: string;
  label: string;
};

enum ClueDirection {
  ACROSS = 0,
  DOWN
}

type ClueState = {
  direction: ClueDirection;
  cells: number[];
  label: string;
  text: string;
  relatives: number[];
};

const selectionSlice = createSlice({
  name: "selection",
  reducers: {
    cellClick: (state, action: PayloadAction<number>) => {}
  },
  initialState: {} as SliceState
});

export default {};
