const simpleWithOutValueOperators: { [key: string]: Function } = {
    '!!': () => (value: string | number) => !!value,
    '!': () => (value: string | number) => !value,
};

const simpleWithValueOperators: { [key: string]: Function } = {
    '<': (_compileValue: string) => (value: string | number) => value < _compileValue,
    '>': (_compileValue: string) => (value: string | number) => value > _compileValue,
    '=': (_compileValue: string) => (value: string | number) => value == _compileValue,
    '==': (_compileValue: string) => (value: string | number) => value == _compileValue,
    '!=': (_compileValue: string) => (value: string | number) => value != _compileValue,
    '>=': (_compileValue: string) => (value: string | number) => value >= _compileValue,
    '<=': (_compileValue: string) => (value: string | number) => value <= _compileValue,
};
//const _simpleWithValueRx = /^\s*([>!=<]{1,2})\s?(-?\d+(\.\d+)?)\s*$/;
const _simpleWithValueRx = new RegExp(`^\\s*(${Object.keys(simpleWithValueOperators).join('|')})\\s*(-?.*)\s*$`);

const operators: [RegExp, Function][] = [];

export function compileSimpleOperatorFunction(operation: string): (value: any) => boolean {
    // Simple Without value:
    let _operatorFunc = simpleWithOutValueOperators[operation.trim()];
    if (_operatorFunc) {
        return _operatorFunc();
    }

    var _operatorMatches: RegExpExecArray | null;
    _simpleWithValueRx.lastIndex = 0;
    if ((_operatorMatches = _simpleWithValueRx.exec(operation))) {
        let _operator = _operatorMatches[1].trim();
        let _value = _operatorMatches[2];
        _operatorFunc = simpleWithValueOperators[_operator];
        if (_operatorFunc) {
            return _operatorFunc(_value);
        }
        throw new Error(`operator \"${_operator}\" is unknown`);
    }

    let _operator = operators.find((o) => {
        o[0].lastIndex = 0;
        return o[0].test(operation);
    });

    if (_operator) {
        return _operator[1](operation);
    }
    // NOT FOUND
    throw new Error(`operator "${operation}" not supported`);
}
