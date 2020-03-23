import "reflect-metadata";
import {
  IsString,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsArray,
  IsEnum,
  IsInt,
  ArrayNotEmpty,
  IsNumberString,
  IsOptional,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  IsDefined,
  ValidateIf
} from "class-validator";

import { Type } from "class-transformer";
import { transformAndValidateSync } from "class-transformer-validator";

class BoardElement {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsObject()
  attributes?: { [name: string]: string };

  @ValidateNested()
  @Type(() => BoardElement)
  children!: BoardElement[];
}

enum ClueDirection {
  ACROSS = 0,
  DOWN
}

class Clue {
  @IsEnum(ClueDirection)
  list!: ClueDirection;

  @IsInt({ each: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  cells!: number[];

  @IsNumberString()
  label!: string;

  @IsString()
  text!: string;

  @IsOptional()
  @IsInt({ each: true })
  @ArrayUnique()
  relatives?: number[];

  @IsInt()
  next!: number;

  @IsInt()
  prev!: number;
}

enum CellType {
  BLACK = 0,
  LETTER,
  CIRCLED,
  SHADED
}

class Cell {
  @IsEnum(CellType)
  type!: CellType;

  @ValidateIf(o => o.type !== CellType.BLACK)
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ArrayUnique()
  clues!: number[];

  @IsString()
  @IsOptional()
  guess?: string;
}

export default class State {
  @ValidateNested()
  @IsDefined()
  @Type(() => BoardElement)
  board!: BoardElement;

  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => Cell)
  cells!: Cell[];

  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => Clue)
  clues!: Clue[];

  toPlainObj() {
    return Object.assign({}, this);
  }

  static parse(object: any) {
    return transformAndValidateSync(State, object, {
      validator: { whitelist: true }
    });
  }
}
