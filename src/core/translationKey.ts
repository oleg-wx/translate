import globalSettings from './globalSettings';
import { DictionaryEntry } from './types';

export class TranslateKeyInstance {
    readonly asString: string;
    readonly asArray: string[];

    constructor(key: string | string[]) {
        if (!Array.isArray(key) && typeof key !== 'string') {
            key = '' + key;
        }
        var namespaceSeparator = globalSettings.namespaceSeparator;
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
}

export type GetDictionaryEntry = (
    lang: string,
    key: TranslateKeyInstance
) => DictionaryEntry | string | undefined;
