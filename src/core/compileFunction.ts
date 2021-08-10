import { Contains, SimpleCompare } from './types';

const simpleOperators: { [key: string]: Function } = {
    '<': (_value: string) => (val: string | number) => val < _value,
    '>': (_value: string) => (val: string | number) => val > _value,
    '=': (_value: string) => (val: string | number) => val == _value,
    '==': (_value: string) => (val: string | number) => val == _value,
    '!=': (_value: string) => (val: string | number) => val != _value,
    '>=': (_value: string) => (val: string | number) => val >= _value,
    '<=': (_value: string) => (val: string | number) => val <= _value,
};

const operators: [RegExp, Function][] = [];
operators.push([
    /^in\s/,
    (operation: string) => {
        const array = operation.replace(
            /in (\[(\-?\d+(\.\d+)?[\,\s]*)+\])/g,
            function (all, arr) {
                return arr;
            }
        );
        var _array: number[];
        try {
            _array = JSON.parse(array) as Array<number>;
        } catch (e) {
            throw new Error(`wrong array format: "${array}"`);
        }
        return function (val: string | number) {
            return _array.includes(+val);
        };
    },
]);
operators.push([
    /^between\s/,
    (operation: string) => {
        const match = /between (\-?\d+(\.\d+)?) and (\-?\d+(\.\d+)?)/g.exec(operation);
        if (match) {
            const from = Math.min(+match[1], +match[3]);
            const to = Math.max(+match[1], +match[3]);
            return function (val: string | number) {
                return val <= to && val >= from;
            };
        }else{
          throw new Error(`wrong between format: "${operation}"`);
        }
    },
]);

export function compileFunction(
    operation: SimpleCompare | Contains
): (val: number) => boolean {
    var _operExec;
    // Simple
    if ((_operExec = /^\s*([>!=<]{1,2})\s?(-?\d+(\.\d+)?)\s*$/.exec(operation))) {
        let _operator = _operExec[1].trim();
        let _value = _operExec[2];
        const operatorFunc = simpleOperators[_operator];
        if (operatorFunc) {
            return operatorFunc(_value);
        }
        throw new Error(`operator \"${_operator}\" is unknown`);
    }

    let operatorFunc = operators.find((o) => (o[0].lastIndex = 0) || o[0].test(operation));
    if (operatorFunc) {
        return operatorFunc[1](operation);
    }
    // NOT FOUND
    throw new Error(`operator "${operation}" not supported`);
}
