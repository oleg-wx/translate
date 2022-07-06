import { Operator } from '../types';

function upper(val: any) {
    if (typeof val === 'string') {
        return val.toUpperCase();
    }
    return val;
}

const simpleWithoutValueOperators: { [key: string]: Function } = {
    '!!': () => (value: string | number | boolean | Date) => !!value,
    '!': () => (value: string | number | boolean | Date) => !value,
};

const simpleWithValueOperators: { [key: string]: Operator['exec'] } = {
    '<': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) < _compileValue,
    '>': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) > _compileValue,
    '=': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) == _compileValue,
    '==': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) == _compileValue,
    '!=': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) != _compileValue,
    '>=': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) >= _compileValue,
    '<=': (_compileValue: string) => (value: string | number | boolean | Date) => upper(value) <= _compileValue,
};

function escapeRegExp(val: string): string {
    return val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export class TruthyFalsyOperator implements Operator {
    constructor() {}

    test(operation: string) {
        let _operatorFunc = simpleWithoutValueOperators[operation.trim()];
        return !!_operatorFunc;
    }

    exec(operation: string) {
        let _operatorFunc = simpleWithoutValueOperators[operation.trim()];
        if (_operatorFunc) {
            return _operatorFunc();
        }
    }
}

export class CompareOperator implements Operator {
    protected _simpleRx = new RegExp(
        `^\\s*(${Object.keys(simpleWithValueOperators)
            .sort((x, y) => y.length - x.length)
            .map((key) => escapeRegExp(key))
            .join('|')})\\s*([\\d\\w\\s,.+\\-_?!@#$^&*()].*)\\s*$`
    );

    constructor() {}

    test(operation: string) {
        this._simpleRx.lastIndex = 0;
        return this._simpleRx.test(operation);
    }

    exec(operation: string) {
        this._simpleRx.lastIndex = 0;
        let _operatorFunc: ReturnType<Operator['exec']> | undefined = undefined;
        var _operatorMatches: RegExpExecArray | null;
        this._simpleRx.lastIndex = 0;
        if ((_operatorMatches = this._simpleRx.exec(operation))) {
            let _operator = _operatorMatches[1].trim();
            let _value = _operatorMatches[2];
            _operatorFunc = simpleWithValueOperators[_operator]?.(_value.toUpperCase());
            if (_operatorFunc) {
                return _operatorFunc;
            }
        }
        throw new Error(`operator \"${operation}\" is unknown`);
    }
}

export const truthyFalsyOperator = new TruthyFalsyOperator();
export const compareOperator = new CompareOperator();
