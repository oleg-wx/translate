import { SimpleCompare, Contains } from "./Translations";

export function compileFunction(
  operation: SimpleCompare | Contains
): (val: number) => boolean {
  var _operExec;
  if ((_operExec = /^\s*([>=<]{1,2})\s?(-?\d+)\s*$/.exec(operation))) {
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
      default:
        throw new Error(`operator \"${_operator}\" is unknown`);
    }
  } else if (operation.indexOf("in ") == 0) {
    const array = operation.replace(/in (\[[\d\s,]+\])/g, function (all, arr) {
      return arr;
    });
    var _array: number[];
    try {
      _array = JSON.parse(array) as Array<number>;
    } catch (e) {
      throw new Error(`wrong array format: "${array}"`);
    }
    return function (val: string | number) {
      return _array.includes(+val);
    };
  } else if (operation.indexOf("between ") == 0) {
    const match = /between (\-?\d+) and (\-?\d+)/.exec(operation);
    if (match) {
      const from = Math.min(+match[1], +match[2]);
      const to = Math.max(+match[1], +match[2]);
      return function (val: string | number) {
        return val <= to && val >= from;
      };
    }
  }
  throw new Error(`operator "${operation}" not supported`);
}
