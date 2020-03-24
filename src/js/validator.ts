import { JSONSchema7 } from "json-schema";
import Ajv from "ajv";

export class MessageValidator<T> {
  private readonly _validate: Ajv.ValidateFunction;
  constructor(schema: JSONSchema7) {
    const ajv = new Ajv({ removeAdditional: true });
    this._validate = ajv.compile(schema);
  }

  validate(data: any): T {
    if (this._validate(data)) {
      return data as T;
    }

    throw this._validate.errors;
  }
}
