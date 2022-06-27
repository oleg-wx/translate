import { TranslateKey } from './types';
import { TranslateKeyInstance } from './translation-key';

export function createKeyInstance(key: TranslateKey) {
    // guard from wrong key
    if (typeof key !== 'string' &&
        !Array.isArray(key) &&
        typeof key !== 'number') {
        throw new Error('"key" parameter is required');
    }
    return new TranslateKeyInstance(key);
}
