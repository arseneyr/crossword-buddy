'use strict';
var ucs2length = require('ajv/lib/compile/ucs2length');
var equal = require('ajv/lib/compile/equal');
var validate = (function() {
  var pattern0 = new RegExp('^[0-9]+$');
  var refVal = [];
  var refVal1 = (function() {
    var pattern0 = new RegExp('^[0-9]+$');
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
      'use strict';
      var vErrors = null;
      var errors = 0;
      if ((data && typeof data === "object" && !Array.isArray(data))) {
        if (true) {
          var errs__0 = errors;
          var valid1 = true;
          var data1 = data.cells;
          if (data1 === undefined) {
            valid1 = false;
            validate.errors = [{
              keyword: 'required',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/required',
              params: {
                missingProperty: 'cells'
              },
              message: 'should have required property \'cells\''
            }];
            return false;
          } else {
            var errs_1 = errors;
            if (Array.isArray(data1)) {
              if (data1.length < 1) {
                validate.errors = [{
                  keyword: 'minItems',
                  dataPath: (dataPath || '') + '.cells',
                  schemaPath: '#/properties/cells/minItems',
                  params: {
                    limit: 1
                  },
                  message: 'should NOT have fewer than 1 items'
                }];
                return false;
              } else {
                var errs__1 = errors;
                var valid1;
                for (var i1 = 0; i1 < data1.length; i1++) {
                  var data2 = data1[i1];
                  var errs_2 = errors;
                  if ((typeof data2 !== "number" || (data2 % 1) || data2 !== data2)) {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.cells[' + i1 + ']',
                      schemaPath: '#/properties/cells/items/type',
                      params: {
                        type: 'integer'
                      },
                      message: 'should be integer'
                    }];
                    return false;
                  }
                  var valid2 = errors === errs_2;
                  if (!valid2) break;
                }
                if (errs__1 == errors) {
                  var i = data1.length,
                    valid1 = true,
                    j;
                  if (i > 1) {
                    var itemIndices = {},
                      item;
                    for (; i--;) {
                      var item = data1[i];
                      if ((typeof item !== "number" || (item % 1) || item !== item)) continue;
                      if (typeof itemIndices[item] == 'number') {
                        valid1 = false;
                        j = itemIndices[item];
                        break;
                      }
                      itemIndices[item] = i;
                    }
                  }
                  if (!valid1) {
                    validate.errors = [{
                      keyword: 'uniqueItems',
                      dataPath: (dataPath || '') + '.cells',
                      schemaPath: '#/properties/cells/uniqueItems',
                      params: {
                        i: i,
                        j: j
                      },
                      message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)'
                    }];
                    return false;
                  }
                }
              }
            } else {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.cells',
                schemaPath: '#/properties/cells/type',
                params: {
                  type: 'array'
                },
                message: 'should be array'
              }];
              return false;
            }
            var valid1 = errors === errs_1;
          }
          if (valid1) {
            var data1 = data.label;
            if (data1 === undefined) {
              valid1 = false;
              validate.errors = [{
                keyword: 'required',
                dataPath: (dataPath || '') + "",
                schemaPath: '#/required',
                params: {
                  missingProperty: 'label'
                },
                message: 'should have required property \'label\''
              }];
              return false;
            } else {
              var errs_1 = errors;
              if (typeof data1 === "string") {
                if (ucs2length(data1) > 3) {
                  validate.errors = [{
                    keyword: 'maxLength',
                    dataPath: (dataPath || '') + '.label',
                    schemaPath: '#/properties/label/maxLength',
                    params: {
                      limit: 3
                    },
                    message: 'should NOT be longer than 3 characters'
                  }];
                  return false;
                } else {
                  if (!pattern0.test(data1)) {
                    validate.errors = [{
                      keyword: 'pattern',
                      dataPath: (dataPath || '') + '.label',
                      schemaPath: '#/properties/label/pattern',
                      params: {
                        pattern: '^[0-9]+$'
                      },
                      message: 'should match pattern "^[0-9]+$"'
                    }];
                    return false;
                  }
                }
              } else {
                validate.errors = [{
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.label',
                  schemaPath: '#/properties/label/type',
                  params: {
                    type: 'string'
                  },
                  message: 'should be string'
                }];
                return false;
              }
              var valid1 = errors === errs_1;
            }
            if (valid1) {
              if (data.text === undefined) {
                valid1 = false;
                validate.errors = [{
                  keyword: 'required',
                  dataPath: (dataPath || '') + "",
                  schemaPath: '#/required',
                  params: {
                    missingProperty: 'text'
                  },
                  message: 'should have required property \'text\''
                }];
                return false;
              } else {
                var errs_1 = errors;
                if (typeof data.text !== "string") {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.text',
                    schemaPath: '#/properties/text/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  }];
                  return false;
                }
                var valid1 = errors === errs_1;
              }
              if (valid1) {
                var data1 = data.relatives;
                if (data1 === undefined) {
                  valid1 = true;
                } else {
                  var errs_1 = errors;
                  if (Array.isArray(data1)) {
                    if (data1.length < 1) {
                      validate.errors = [{
                        keyword: 'minItems',
                        dataPath: (dataPath || '') + '.relatives',
                        schemaPath: '#/properties/relatives/minItems',
                        params: {
                          limit: 1
                        },
                        message: 'should NOT have fewer than 1 items'
                      }];
                      return false;
                    } else {
                      var errs__1 = errors;
                      var valid1;
                      for (var i1 = 0; i1 < data1.length; i1++) {
                        var data2 = data1[i1];
                        var errs_2 = errors;
                        if ((typeof data2 !== "number" || (data2 % 1) || data2 !== data2)) {
                          validate.errors = [{
                            keyword: 'type',
                            dataPath: (dataPath || '') + '.relatives[' + i1 + ']',
                            schemaPath: '#/properties/relatives/items/type',
                            params: {
                              type: 'integer'
                            },
                            message: 'should be integer'
                          }];
                          return false;
                        }
                        var valid2 = errors === errs_2;
                        if (!valid2) break;
                      }
                      if (errs__1 == errors) {
                        var i = data1.length,
                          valid1 = true,
                          j;
                        if (i > 1) {
                          var itemIndices = {},
                            item;
                          for (; i--;) {
                            var item = data1[i];
                            if ((typeof item !== "number" || (item % 1) || item !== item)) continue;
                            if (typeof itemIndices[item] == 'number') {
                              valid1 = false;
                              j = itemIndices[item];
                              break;
                            }
                            itemIndices[item] = i;
                          }
                        }
                        if (!valid1) {
                          validate.errors = [{
                            keyword: 'uniqueItems',
                            dataPath: (dataPath || '') + '.relatives',
                            schemaPath: '#/properties/relatives/uniqueItems',
                            params: {
                              i: i,
                              j: j
                            },
                            message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)'
                          }];
                          return false;
                        }
                      }
                    }
                  } else {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.relatives',
                      schemaPath: '#/properties/relatives/type',
                      params: {
                        type: 'array'
                      },
                      message: 'should be array'
                    }];
                    return false;
                  }
                  var valid1 = errors === errs_1;
                }
                if (valid1) {
                  var data1 = data.next;
                  if (data1 === undefined) {
                    valid1 = false;
                    validate.errors = [{
                      keyword: 'required',
                      dataPath: (dataPath || '') + "",
                      schemaPath: '#/required',
                      params: {
                        missingProperty: 'next'
                      },
                      message: 'should have required property \'next\''
                    }];
                    return false;
                  } else {
                    var errs_1 = errors;
                    if ((typeof data1 !== "number" || (data1 % 1) || data1 !== data1)) {
                      validate.errors = [{
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.next',
                        schemaPath: '#/properties/next/type',
                        params: {
                          type: 'integer'
                        },
                        message: 'should be integer'
                      }];
                      return false;
                    }
                    var valid1 = errors === errs_1;
                  }
                  if (valid1) {
                    var data1 = data.prev;
                    if (data1 === undefined) {
                      valid1 = false;
                      validate.errors = [{
                        keyword: 'required',
                        dataPath: (dataPath || '') + "",
                        schemaPath: '#/required',
                        params: {
                          missingProperty: 'prev'
                        },
                        message: 'should have required property \'prev\''
                      }];
                      return false;
                    } else {
                      var errs_1 = errors;
                      if ((typeof data1 !== "number" || (data1 % 1) || data1 !== data1)) {
                        validate.errors = [{
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.prev',
                          schemaPath: '#/properties/prev/type',
                          params: {
                            type: 'integer'
                          },
                          message: 'should be integer'
                        }];
                        return false;
                      }
                      var valid1 = errors === errs_1;
                    }
                    if (valid1) {
                      var data1 = data.list;
                      if (data1 === undefined) {
                        valid1 = false;
                        validate.errors = [{
                          keyword: 'required',
                          dataPath: (dataPath || '') + "",
                          schemaPath: '#/required',
                          params: {
                            missingProperty: 'list'
                          },
                          message: 'should have required property \'list\''
                        }];
                        return false;
                      } else {
                        var errs_1 = errors;
                        var errs_2 = errors;
                        if (typeof data1 !== "number") {
                          validate.errors = [{
                            keyword: 'type',
                            dataPath: (dataPath || '') + '.list',
                            schemaPath: '#/definitions/ClueDirection/type',
                            params: {
                              type: 'number'
                            },
                            message: 'should be number'
                          }];
                          return false;
                        }
                        var schema2 = refVal2.enum;
                        var valid2;
                        valid2 = false;
                        for (var i2 = 0; i2 < schema2.length; i2++)
                          if (equal(data1, schema2[i2])) {
                            valid2 = true;
                            break;
                          } if (!valid2) {
                          validate.errors = [{
                            keyword: 'enum',
                            dataPath: (dataPath || '') + '.list',
                            schemaPath: '#/definitions/ClueDirection/enum',
                            params: {
                              allowedValues: schema2
                            },
                            message: 'should be equal to one of the allowed values'
                          }];
                          return false;
                        }
                        var valid2 = errors === errs_2;
                        var valid1 = errors === errs_1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        validate.errors = [{
          keyword: 'type',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/type',
          params: {
            type: 'object'
          },
          message: 'should be object'
        }];
        return false;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal1.schema = {
    "type": "object",
    "properties": {
      "cells": {
        "minItems": 1,
        "uniqueItems": true,
        "type": "array",
        "items": {
          "type": "integer"
        }
      },
      "label": {
        "pattern": "^[0-9]+$",
        "maxLength": 3,
        "type": "string"
      },
      "text": {
        "type": "string"
      },
      "relatives": {
        "minItems": 1,
        "uniqueItems": true,
        "type": "array",
        "items": {
          "type": "integer"
        }
      },
      "next": {
        "type": "integer"
      },
      "prev": {
        "type": "integer"
      },
      "list": {
        "$ref": "#/definitions/ClueDirection"
      }
    },
    "required": ["cells", "label", "list", "next", "prev", "text"]
  };
  refVal1.errors = null;
  refVal[1] = refVal1;
  var refVal2 = {
    "enum": [0, 1],
    "type": "number"
  };
  refVal[2] = refVal2;
  var refVal3 = (function() {
    var pattern0 = new RegExp('^[0-9]+$');
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
      'use strict';
      var vErrors = null;
      var errors = 0;
      if ((data && typeof data === "object" && !Array.isArray(data))) {
        if (true) {
          var errs__0 = errors;
          var valid1 = true;
          var data1 = data.type;
          if (data1 === undefined) {
            valid1 = false;
            validate.errors = [{
              keyword: 'required',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/required',
              params: {
                missingProperty: 'type'
              },
              message: 'should have required property \'type\''
            }];
            return false;
          } else {
            var errs_1 = errors;
            var errs_2 = errors;
            if (typeof data1 !== "number") {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.type',
                schemaPath: '#/definitions/CellType/type',
                params: {
                  type: 'number'
                },
                message: 'should be number'
              }];
              return false;
            }
            var schema2 = refVal4.enum;
            var valid2;
            valid2 = false;
            for (var i2 = 0; i2 < schema2.length; i2++)
              if (equal(data1, schema2[i2])) {
                valid2 = true;
                break;
              } if (!valid2) {
              validate.errors = [{
                keyword: 'enum',
                dataPath: (dataPath || '') + '.type',
                schemaPath: '#/definitions/CellType/enum',
                params: {
                  allowedValues: schema2
                },
                message: 'should be equal to one of the allowed values'
              }];
              return false;
            }
            var valid2 = errors === errs_2;
            var valid1 = errors === errs_1;
          }
          if (valid1) {
            var data1 = data.clues;
            if (data1 === undefined) {
              valid1 = false;
              validate.errors = [{
                keyword: 'required',
                dataPath: (dataPath || '') + "",
                schemaPath: '#/required',
                params: {
                  missingProperty: 'clues'
                },
                message: 'should have required property \'clues\''
              }];
              return false;
            } else {
              var errs_1 = errors;
              if (Array.isArray(data1)) {
                var errs__1 = errors;
                var valid1;
                for (var i1 = 0; i1 < data1.length; i1++) {
                  var data2 = data1[i1];
                  var errs_2 = errors;
                  if ((typeof data2 !== "number" || (data2 % 1) || data2 !== data2)) {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.clues[' + i1 + ']',
                      schemaPath: '#/properties/clues/items/type',
                      params: {
                        type: 'integer'
                      },
                      message: 'should be integer'
                    }];
                    return false;
                  }
                  var valid2 = errors === errs_2;
                  if (!valid2) break;
                }
                if (errs__1 == errors) {
                  var i = data1.length,
                    valid1 = true,
                    j;
                  if (i > 1) {
                    var itemIndices = {},
                      item;
                    for (; i--;) {
                      var item = data1[i];
                      if ((typeof item !== "number" || (item % 1) || item !== item)) continue;
                      if (typeof itemIndices[item] == 'number') {
                        valid1 = false;
                        j = itemIndices[item];
                        break;
                      }
                      itemIndices[item] = i;
                    }
                  }
                  if (!valid1) {
                    validate.errors = [{
                      keyword: 'uniqueItems',
                      dataPath: (dataPath || '') + '.clues',
                      schemaPath: '#/properties/clues/uniqueItems',
                      params: {
                        i: i,
                        j: j
                      },
                      message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)'
                    }];
                    return false;
                  }
                }
              } else {
                validate.errors = [{
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.clues',
                  schemaPath: '#/properties/clues/type',
                  params: {
                    type: 'array'
                  },
                  message: 'should be array'
                }];
                return false;
              }
              var valid1 = errors === errs_1;
            }
            if (valid1) {
              if (data.guess === undefined) {
                valid1 = true;
              } else {
                var errs_1 = errors;
                if (typeof data.guess !== "string") {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.guess',
                    schemaPath: '#/properties/guess/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  }];
                  return false;
                }
                var valid1 = errors === errs_1;
              }
            }
          }
        }
      } else {
        validate.errors = [{
          keyword: 'type',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/type',
          params: {
            type: 'object'
          },
          message: 'should be object'
        }];
        return false;
      }
      if (errors === 0) {
        var errs__0 = errors;
        var valid0 = true;
        var errs_1 = errors;
        if ((data && typeof data === "object" && !Array.isArray(data))) {
          var errs__1 = errors;
          var valid2 = true;
          if (data.type === undefined) {
            valid2 = true;
          } else {
            var errs_2 = errors;
            var schema2 = validate.schema.if.properties.type.const;
            var valid2 = equal(data.type, schema2);
            if (!valid2) {
              var err = {};
              if (vErrors === null) vErrors = [err];
              else vErrors.push(err);
              errors++;
            }
            var valid2 = errors === errs_2;
          }
        }
        var valid1 = errors === errs_1;
        errors = errs__0;
        if (vErrors !== null) {
          if (errs__0) vErrors.length = errs__0;
          else vErrors = null;
        }
        if (valid1) {
          var errs_1 = errors;
          if ((data && typeof data === "object" && !Array.isArray(data))) {
            var errs__1 = errors;
            var valid2 = true;
            var data1 = data.clues;
            if (data1 === undefined) {
              valid2 = true;
            } else {
              var errs_2 = errors;
              if (Array.isArray(data1)) {
                if (data1.length > 0) {
                  validate.errors = [{
                    keyword: 'maxItems',
                    dataPath: (dataPath || '') + '.clues',
                    schemaPath: '#/then/properties/clues/maxItems',
                    params: {
                      limit: 0
                    },
                    message: 'should NOT have more than 0 items'
                  }];
                  return false;
                }
              }
              var valid2 = errors === errs_2;
            }
          }
          var valid1 = errors === errs_1;
          valid0 = valid1;
          var ifClause0 = 'then';
        } else {
          var errs_1 = errors;
          if ((data && typeof data === "object" && !Array.isArray(data))) {
            var errs__1 = errors;
            var valid2 = true;
            var data1 = data.clues;
            if (data1 === undefined) {
              valid2 = true;
            } else {
              var errs_2 = errors;
              if (Array.isArray(data1)) {
                if (data1.length > 2) {
                  validate.errors = [{
                    keyword: 'maxItems',
                    dataPath: (dataPath || '') + '.clues',
                    schemaPath: '#/else/properties/clues/maxItems',
                    params: {
                      limit: 2
                    },
                    message: 'should NOT have more than 2 items'
                  }];
                  return false;
                } else {
                  if (data1.length < 1) {
                    validate.errors = [{
                      keyword: 'minItems',
                      dataPath: (dataPath || '') + '.clues',
                      schemaPath: '#/else/properties/clues/minItems',
                      params: {
                        limit: 1
                      },
                      message: 'should NOT have fewer than 1 items'
                    }];
                    return false;
                  }
                }
              }
              var valid2 = errors === errs_2;
            }
          }
          var valid1 = errors === errs_1;
          valid0 = valid1;
          var ifClause0 = 'else';
        }
        if (!valid0) {
          var err = {
            keyword: 'if',
            dataPath: (dataPath || '') + "",
            schemaPath: '#/if',
            params: {
              failingKeyword: ifClause0
            },
            message: 'should match "' + ifClause0 + '" schema'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
          validate.errors = vErrors;
          return false;
        }
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal3.schema = {
    "if": {
      "properties": {
        "type": {
          "const": 0
        }
      }
    },
    "then": {
      "properties": {
        "clues": {
          "maxItems": 0
        }
      }
    },
    "else": {
      "properties": {
        "clues": {
          "minItems": 1,
          "maxItems": 2
        }
      }
    },
    "type": "object",
    "properties": {
      "type": {
        "$ref": "#/definitions/CellType"
      },
      "clues": {
        "uniqueItems": true,
        "type": "array",
        "items": {
          "type": "integer"
        }
      },
      "guess": {
        "type": "string"
      }
    },
    "required": ["clues", "type"]
  };
  refVal3.errors = null;
  refVal[3] = refVal3;
  var refVal4 = {
    "enum": [0, 1, 2, 3],
    "type": "number"
  };
  refVal[4] = refVal4;
  return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
    'use strict';
    var vErrors = null;
    var errors = 0;
    if (rootData === undefined) rootData = data;
    if ((data && typeof data === "object" && !Array.isArray(data))) {
      if (true) {
        var errs__0 = errors;
        var valid1 = true;
        var data1 = data.state;
        if (data1 === undefined) {
          valid1 = false;
          validate.errors = [{
            keyword: 'required',
            dataPath: (dataPath || '') + "",
            schemaPath: '#/required',
            params: {
              missingProperty: 'state'
            },
            message: 'should have required property \'state\''
          }];
          return false;
        } else {
          var errs_1 = errors;
          if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
            if (true) {
              var errs__1 = errors;
              var valid2 = true;
              var data2 = data1.clues;
              if (data2 === undefined) {
                valid2 = false;
                validate.errors = [{
                  keyword: 'required',
                  dataPath: (dataPath || '') + '.state',
                  schemaPath: '#/properties/state/required',
                  params: {
                    missingProperty: 'clues'
                  },
                  message: 'should have required property \'clues\''
                }];
                return false;
              } else {
                var errs_2 = errors;
                if (Array.isArray(data2)) {
                  if (data2.length < 1) {
                    validate.errors = [{
                      keyword: 'minItems',
                      dataPath: (dataPath || '') + '.state.clues',
                      schemaPath: '#/properties/state/properties/clues/minItems',
                      params: {
                        limit: 1
                      },
                      message: 'should NOT have fewer than 1 items'
                    }];
                    return false;
                  } else {
                    var errs__2 = errors;
                    var valid2;
                    for (var i2 = 0; i2 < data2.length; i2++) {
                      var errs_3 = errors;
                      if (!refVal1(data2[i2], (dataPath || '') + '.state.clues[' + i2 + ']', data2, i2, rootData)) {
                        if (vErrors === null) vErrors = refVal1.errors;
                        else vErrors = vErrors.concat(refVal1.errors);
                        errors = vErrors.length;
                      }
                      var valid3 = errors === errs_3;
                      if (!valid3) break;
                    }
                  }
                } else {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.state.clues',
                    schemaPath: '#/properties/state/properties/clues/type',
                    params: {
                      type: 'array'
                    },
                    message: 'should be array'
                  }];
                  return false;
                }
                var valid2 = errors === errs_2;
              }
              if (valid2) {
                var data2 = data1.cells;
                if (data2 === undefined) {
                  valid2 = false;
                  validate.errors = [{
                    keyword: 'required',
                    dataPath: (dataPath || '') + '.state',
                    schemaPath: '#/properties/state/required',
                    params: {
                      missingProperty: 'cells'
                    },
                    message: 'should have required property \'cells\''
                  }];
                  return false;
                } else {
                  var errs_2 = errors;
                  if (Array.isArray(data2)) {
                    if (data2.length < 1) {
                      validate.errors = [{
                        keyword: 'minItems',
                        dataPath: (dataPath || '') + '.state.cells',
                        schemaPath: '#/properties/state/properties/cells/minItems',
                        params: {
                          limit: 1
                        },
                        message: 'should NOT have fewer than 1 items'
                      }];
                      return false;
                    } else {
                      var errs__2 = errors;
                      var valid2;
                      for (var i2 = 0; i2 < data2.length; i2++) {
                        var errs_3 = errors;
                        if (!refVal3(data2[i2], (dataPath || '') + '.state.cells[' + i2 + ']', data2, i2, rootData)) {
                          if (vErrors === null) vErrors = refVal3.errors;
                          else vErrors = vErrors.concat(refVal3.errors);
                          errors = vErrors.length;
                        }
                        var valid3 = errors === errs_3;
                        if (!valid3) break;
                      }
                    }
                  } else {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.state.cells',
                      schemaPath: '#/properties/state/properties/cells/type',
                      params: {
                        type: 'array'
                      },
                      message: 'should be array'
                    }];
                    return false;
                  }
                  var valid2 = errors === errs_2;
                }
              }
            }
          } else {
            validate.errors = [{
              keyword: 'type',
              dataPath: (dataPath || '') + '.state',
              schemaPath: '#/properties/state/type',
              params: {
                type: 'object'
              },
              message: 'should be object'
            }];
            return false;
          }
          var valid1 = errors === errs_1;
        }
        if (valid1) {
          var data1 = data.styles;
          if (data1 === undefined) {
            valid1 = false;
            validate.errors = [{
              keyword: 'required',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/required',
              params: {
                missingProperty: 'styles'
              },
              message: 'should have required property \'styles\''
            }];
            return false;
          } else {
            var errs_1 = errors;
            if (Array.isArray(data1)) {
              var errs__1 = errors;
              var valid1;
              for (var i1 = 0; i1 < data1.length; i1++) {
                var errs_2 = errors;
                if (typeof data1[i1] !== "string") {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.styles[' + i1 + ']',
                    schemaPath: '#/properties/styles/items/type',
                    params: {
                      type: 'string'
                    },
                    message: 'should be string'
                  }];
                  return false;
                }
                var valid2 = errors === errs_2;
                if (!valid2) break;
              }
            } else {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.styles',
                schemaPath: '#/properties/styles/type',
                params: {
                  type: 'array'
                },
                message: 'should be array'
              }];
              return false;
            }
            var valid1 = errors === errs_1;
          }
          if (valid1) {
            if (data.html === undefined) {
              valid1 = false;
              validate.errors = [{
                keyword: 'required',
                dataPath: (dataPath || '') + "",
                schemaPath: '#/required',
                params: {
                  missingProperty: 'html'
                },
                message: 'should have required property \'html\''
              }];
              return false;
            } else {
              var errs_1 = errors;
              if (typeof data.html !== "string") {
                validate.errors = [{
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.html',
                  schemaPath: '#/properties/html/type',
                  params: {
                    type: 'string'
                  },
                  message: 'should be string'
                }];
                return false;
              }
              var valid1 = errors === errs_1;
            }
          }
        }
      }
    } else {
      validate.errors = [{
        keyword: 'type',
        dataPath: (dataPath || '') + "",
        schemaPath: '#/type',
        params: {
          type: 'object'
        },
        message: 'should be object'
      }];
      return false;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  "type": "object",
  "properties": {
    "state": {
      "type": "object",
      "properties": {
        "clues": {
          "minItems": 1,
          "type": "array",
          "items": {
            "$ref": "#/definitions/Clue"
          }
        },
        "cells": {
          "minItems": 1,
          "type": "array",
          "items": {
            "$ref": "#/definitions/Cell"
          }
        }
      },
      "required": ["cells", "clues"]
    },
    "styles": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "html": {
      "type": "string"
    }
  },
  "required": ["html", "state", "styles"],
  "definitions": {
    "Clue": {
      "type": "object",
      "properties": {
        "cells": {
          "minItems": 1,
          "uniqueItems": true,
          "type": "array",
          "items": {
            "type": "integer"
          }
        },
        "label": {
          "pattern": "^[0-9]+$",
          "maxLength": 3,
          "type": "string"
        },
        "text": {
          "type": "string"
        },
        "relatives": {
          "minItems": 1,
          "uniqueItems": true,
          "type": "array",
          "items": {
            "type": "integer"
          }
        },
        "next": {
          "type": "integer"
        },
        "prev": {
          "type": "integer"
        },
        "list": {
          "$ref": "#/definitions/ClueDirection"
        }
      },
      "required": ["cells", "label", "list", "next", "prev", "text"]
    },
    "ClueDirection": {
      "enum": [0, 1],
      "type": "number"
    },
    "Cell": {
      "if": {
        "properties": {
          "type": {
            "const": 0
          }
        }
      },
      "then": {
        "properties": {
          "clues": {
            "maxItems": 0
          }
        }
      },
      "else": {
        "properties": {
          "clues": {
            "minItems": 1,
            "maxItems": 2
          }
        }
      },
      "type": "object",
      "properties": {
        "type": {
          "$ref": "#/definitions/CellType"
        },
        "clues": {
          "uniqueItems": true,
          "type": "array",
          "items": {
            "type": "integer"
          }
        },
        "guess": {
          "type": "string"
        }
      },
      "required": ["clues", "type"]
    },
    "CellType": {
      "enum": [0, 1, 2, 3],
      "type": "number"
    }
  },
  "$schema": "http://json-schema.org/draft-07/schema#"
};
validate.errors = null;
module.exports = validate;