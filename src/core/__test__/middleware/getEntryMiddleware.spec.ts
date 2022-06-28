import { TranslateKeyInstance } from '../../translation-key';
import { Dictionaries, TranslateKey } from '../../types';
import { GetEntryMiddleware } from '../../middleware/get-entry-middleware';
import { Context } from '../../types';

describe('when getting dictionary entry', () => {
    function createContextWithKey(key: TranslateKey): Context {
        const lang = 'en';
        const settings = { $less: false };
        const dictionaries: Dictionaries = {
            [lang]: {
                'my-key': 'my-entry',
                another_key: {
                    value: 'another-entry',
                    description: 'descr',
                    plural: {},
                },
            },
        };

        return {
            params: {
                lang,
                dictionaries,
                key: new TranslateKeyInstance(key),
            },
            result: {},
        };
    }
    
    it('should get value', () => {
        const context: Context = createContextWithKey('my-key');
        GetEntryMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-entry');
        expect(context.result.entry).toBe('my-entry');
    });
    it('should get value', () => {
        const context: Context = createContextWithKey('another_key');
        GetEntryMiddleware(context, () => undefined);
        expect(context.result.value).toBe('another-entry');
        //expect(context.result.entry).toBe(context.params.dictionaries['en']['another-entry']);
    });
});

describe('when getting dictionary entry in the namespace', () => {
    function createContextWithKey(key: TranslateKey): Context {
        const lang = 'en';
        const settings = { $less: false };
        const dictionaries = { en: { space: { 'my-key': 'my-entry' } } };

        return {
            params: {
                lang,
                dictionaries,
                key: new TranslateKeyInstance(key),
            },
            result: {},
        };
    }

    it('should get value form namespace with string key', () => {
        const context: Context = createContextWithKey('space.my-key');

        GetEntryMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-entry');
    });
    it('should get value form namespace with array key', () => {
        const context = createContextWithKey(['space', 'my-key']);
        GetEntryMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-entry');
    });
    it('should return undefined if no translation', () => {
        const context = createContextWithKey(['no-key']);
        GetEntryMiddleware(context, () => undefined);
        expect(context.result.value).toBeUndefined();
    });

    it('should return undefined with namespaces if no translation', () => {
        const context = createContextWithKey(['no', 'no-key']);
        GetEntryMiddleware(context, () => undefined);
        expect(context.result.value).toBeUndefined();
    });
});
