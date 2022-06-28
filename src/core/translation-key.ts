import { DictionaryEntry } from './types';

export class TranslateKeyInstance {
    readonly asString: string;
    readonly asArray: string[];

    constructor(key: string | string[]) {
        if (key != null && !Array.isArray(key) && typeof key !== 'string') {
            if ((key as any).toString) {
                key = (key as any).toString();
            } else {
                key = '' + key;
            }
        }
        var namespaceSeparator = '.';
        // separate key by namespace namespace
        if (typeof key === 'string' && key.indexOf(namespaceSeparator) >= 0) {
            this.asString = key;

            this.asArray = key.split(namespaceSeparator).reduce((res, val) => {
                val && res.push(val.trim());
                return res;
            }, [] as string[]);
        } else if (Array.isArray(key)) {
            this.asString = key.join(namespaceSeparator);
            this.asArray = key;
        } else {
            this.asString = key;
            this.asArray = [key];
        }
    }

    toString() {
        return this.asString;
    }
}

export type GetDictionaryEntry = (
    lang: string,
    key: TranslateKeyInstance
) => DictionaryEntry | string | undefined;
