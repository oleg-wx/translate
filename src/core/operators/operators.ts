import { Operator } from "../types";

export abstract class OperatorBase implements Operator {
    constructor(protected _textRx: RegExp, protected _execRx: RegExp) {}

    test(value: string) {
        this._textRx.lastIndex = 0;
        return this._textRx.test(value);
    }

    abstract exec(operation: string): (value: string | number | boolean | Date) => boolean;
}

export class InOperator extends OperatorBase {
    constructor() {
        super(/^in\s/g, /^in (\[(\-?\d+(\.\d+)?[\,\s]*)+\])/);
    }

    exec(operation: string): (value: string | number | boolean | Date) => boolean {
        this._execRx.lastIndex = 0;
        const array = operation.replace(this._execRx, function (all, arr) {
            return arr;
        });
        var _array: number[];
        try {
            _array = JSON.parse(array) as Array<number>;
        } catch (e) {
            throw new Error(`wrong array format: "${array}"`);
        }
        return function (val) {
            return _array.includes(+val);
        };
    }
}

export class BetweenOperator extends OperatorBase {
    constructor() {
        super(/^between\s/g, /^between (\-?\d+(\.\d+)?) and (\-?\d+(\.\d+)?)/);
    }

    exec(operation: string): (value: string | number | boolean | Date) => boolean {
        this._execRx.lastIndex = 0;
        const match = this._execRx.exec(operation);
        if (match) {
            const from = Math.min(+match[1], +match[3]);
            const to = Math.max(+match[1], +match[3]);
            return function (val) {
                let _val = Number(val);
                return _val <= to && _val >= from;
            };
        } else {
            throw new Error(`wrong between format: "${operation}"`);
        }
    }
}

export class RemainderOperator extends OperatorBase {
    constructor() {
        super(/^%\s?[\d\.]+/g, /^%\s?([\d\.]+)\s?(=\s?([\d\.]+))?/);
    }

    exec(operation: string): (value: string | number | boolean | Date) => boolean {
        this._execRx.lastIndex = 0;
        const match = this._execRx.exec(operation);
        if (match) {
            const div = +match[1];
            const compare = +(match[3] ?? 0);
            return function (val) {
                let _val = Number(val);
                return _val % div == compare;
            };
        } else {
            throw new Error(`wrong modulo format: "${operation}"`);
        }
    }
}

export class EndsWithOperator extends OperatorBase {
    constructor() {
        super(/^\.\.\.\s*.+/g, /^\.\.\.\s*(.+)/);
    }

    exec(operation: string): (value: string | number | boolean | Date) => boolean {
        this._execRx.lastIndex = 0;
        const match = this._execRx.exec(operation);
        if (match) {
            const last = match[1];
            return function (val) {
                return String(val).endsWith(last);
            };
        } else {
            throw new Error(`wrong ends format: "${operation}"`);
        }
    }
}

export class StartsWithOperator extends OperatorBase {
    constructor() {
        super(/.+\s*\.\.\.$/g, /^(.+)\s*\.\.\.$/);
    }

    exec(operation: string): (value: string | number | boolean | Date) => boolean {
        this._execRx.lastIndex = 0;
        const match = this._execRx.exec(operation);
        if (match) {
            const last = match[1];
            return function (val) {
                return String(val).startsWith(last);
            };
        } else {
            throw new Error(`wrong starts format: "${operation}"`);
        }
    }
}

export const inOperator = new InOperator();
export const betweenOperator = new BetweenOperator();
export const remainderOperator = new RemainderOperator();
export const endsWithOperator = new EndsWithOperator();
export const startsWithOperator = new StartsWithOperator();


