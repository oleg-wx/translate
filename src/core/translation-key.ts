import { DictionaryEntry } from './types';

const namespaceSeparator = '.';

export class TranslateKeyInstance {
    private _value: string | string[];
    private _asString?: string;
    private _asArray?: string[];

    get asString(): string {
        if (this._asString) {
            return this._asString;
        }

        if (typeof this._value === 'string') {
            this._asString = this._value.trim();
        } else if (Array.isArray(this._value)) {
            this._asString = this._value.join(namespaceSeparator);
        } else if (this._value != null) {
            this._asString = String(this._value).trim();
        }

        return this._asString ?? '';
    }

    get asArray(): string[] {
        if (this._asArray) {
            return this._asArray;
        }

        if (typeof this._value === 'string') {
            this._asArray = this._value.split(namespaceSeparator).map(s => s.trim());
        } else if (Array.isArray(this._value)) {
            this._asArray = this._value;
        }

        return this._asArray ?? [];
    }

    constructor(key: string | string[]) {
        this._value = key;
    }

    toString() {
        return this.asString;
    }
}

export type GetDictionaryEntry = (
    lang: string,
    key: TranslateKeyInstance
) => DictionaryEntry | string | undefined;
