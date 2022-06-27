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

const _in = [/^in\s/g, /^in (\[(\-?\d+(\.\d+)?[\,\s]*)+\])/];
operators.push([
    _in[0],
    (operation: string) => {
        _in[1].lastIndex = 0;
        const array = operation.replace(_in[1], function (all, arr) {
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
    },
]);

const _between = [
    /^between\s/g,
    /^between (\-?\d+(\.\d+)?) and (\-?\d+(\.\d+)?)/,
];
operators.push([
    _between[0],
    (operation: string) => {
        _between[1].lastIndex = 0;
        const match = _between[1].exec(operation);
        if (match) {
            const from = Math.min(+match[1], +match[3]);
            const to = Math.max(+match[1], +match[3]);
            return function (val: string | number) {
                return val <= to && val >= from;
            };
        } else {
            throw new Error(`wrong between format: "${operation}"`);
        }
    },
]);

const _remainder = [/^%\s?[\d\.]+/g, /^%\s?([\d\.]+)\s?(=\s?([\d\.]+))?/];
operators.push([
    _remainder[0],
    (operation: string) => {
        _remainder[1].lastIndex = 0;
        const match = _remainder[1].exec(operation);
        if (match) {
            const div = +match[1];
            const compare = +(match[3] ?? 0);
            return function (val: string | number) {
                return +val % div == compare;
            };
        } else {
            throw new Error(`wrong modulo format: "${operation}"`);
        }
    },
]);

const _simple = /^\s*([>!=<]{1,2})\s?(-?\d+(\.\d+)?)\s*$/;
export function compileFunction(
    operation: SimpleCompare | Contains
): (val: number) => boolean {
    var _operExec;
    // Simple
    _simple.lastIndex = 0;
    if ((_operExec = _simple.exec(operation))) {
        let _operator = _operExec[1].trim();
        let _value = _operExec[2];
        const operatorFunc = simpleOperators[_operator];
        if (operatorFunc) {
            return operatorFunc(_value);
        }
        throw new Error(`operator \"${_operator}\" is unknown`);
    }

    let operatorFunc = operators.find((o) => {
        o[0].lastIndex = 0;
        return o[0].test(operation);
    });
    
    if (operatorFunc) {
        return operatorFunc[1](operation);
    }
    // NOT FOUND
    throw new Error(`operator "${operation}" not supported`);
}
