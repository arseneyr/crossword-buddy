export enum ClueDirection {
  ACROSS = 0,
  DOWN
}

export interface Clue {
  /**
   * @minItems 1
   * @uniqueItems true
   */
  cells: number[];

  /**
   * @pattern ^[0-9]+$
   * @maxLength 3
   */
  label: string;

  text: string;

  /**
   * @minItems 1
   * @uniqueItems true
   */
  relatives?: number[];

  next: number;

  prev: number;

  list: ClueDirection;
}

export enum CellType {
  BLACK = 0,
  LETTER,
  CIRCLED,
  SHADED
}

/**
 * @if {"properties": {"type": {"const": 0}}}
 * @then {"properties": {"clues": {"maxItems": 0}}}
 * @else {"properties": {"clues": {"minItems": 1, "maxItems": 2}}}
 */
export interface Cell {
  type: CellType;

  /**
   * @uniqueItems true
   */
  clues: number[];

  guess?: string;
}

export interface NYTState {
  /**
   * @minItems 1
   */
  clues: Clue[];

  /**
   * @minItems 1
   */
  cells: Cell[];
}

export interface InitialMessage {
  state: NYTState;

  styles: string[];

  html: string;
}
