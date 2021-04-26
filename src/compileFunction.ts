import { SimpleCompare, Contains } from "./Translations";

export function compileFunction(
  operation: SimpleCompare | Contains
): (val: string | number) => boolean {
  var _operExec;
  if ((_operExec = /^([>=<]{1,2})\s?(-?\d+)/.exec(operation))) {
    let _operator = _operExec[1];
    let _value = _operExec[2];
    switch (_operator) {
      case "<":
        return function (val: string | number) {
          return val < _value;
        };
      case ">":
        return function (val: string | number) {
          return val > _value;
        };
      case "=":
        return function (val: string | number) {
          return val == _value;
        };
      case ">=":
        return function (val: string | number) {
          return val >= _value;
        };
      case "<=":
        return function (val: string | number) {
          return val <= _value;
        };
        default: throw `operator \"${_operator}\" is unknown`
    }
  } else if (operation.indexOf("in [") == 0) {
    let array = operation.replace(/in (\[[\d\s,]+\])/g, function (all, arr) {
      return arr;
    });
    var _array = JSON.parse(array) as Array<number>;
    return function (val: string | number) {
      return _array.includes(+val);
    };
  }
  try {
    let _otmp = "this " + operation;
    var fn = Function('"use strict"; return ' + _otmp) as any;
    return function (val) {
      return fn(val);
    };
  } catch (e) {
    throw `operator \"${operation}\" not supported`;
  }
}
