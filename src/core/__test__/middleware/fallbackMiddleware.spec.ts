import { TranslateKeyInstance } from '../../translation-key';
import { Dictionaries, TranslateKey } from '../../types';
import { Context } from '../../types';
import { FallbackMiddleware } from '../../middleware/fallback-middleware';

describe('when getting fallback value or key', () => {
    function createContextWithKey(key: TranslateKey,fallback?:string): Context {
        const lang = 'en';
        const dictionaries: Dictionaries = {
            [lang]: {
                'my-key': 'my-entry',
            },
        };

        return {
            params: {
                lang,
                dictionaries,
                key: new TranslateKeyInstance(key),
                fallback
            },
            result: {},
        };
    }

    it('should fallback to key if no fallback value provided', () => {
        const context: Context = createContextWithKey('my-key');
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-key');
        expect(context.result.fallingBack).toBe(true);
    });
    it('should fallback to key if no fallback value provided', () => {
        const context: Context = createContextWithKey('my-namespace.my-key');
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-namespace.my-key');
        expect(context.result.fallingBack).toBe(true);
    });
    it('should fallback to key if no fallback value provided', () => {
        const context: Context = createContextWithKey(['my-namespace', 'my-key']);
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-namespace.my-key');
        expect(context.result.fallingBack).toBe(true);
    });

    it('should get fallback when provided', () => {
        const context: Context = createContextWithKey('my-key','my-fallback');
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('my-fallback');
        expect(context.result.fallingBack).toBe(true);
    });
    it('should get empty string if key or fallback not provided', () => {
        const context: Context = createContextWithKey(undefined!,undefined);
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('');
        expect(context.result.fallingBack).toBe(true);
    });
    it('should get string if number is provided', () => {
        const context: Context = createContextWithKey(10 as unknown as string);
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('10');
        expect(context.result.fallingBack).toBe(true);
    });
    it('should get string if object is provided', () => {
        const context: Context = createContextWithKey({} as unknown as string);
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toBe('[object Object]');
        expect(context.result.fallingBack).toBe(true);
    });
    it('should get string if object is provided', () => {
        const context: Context = createContextWithKey(new Date(2000,0,1) as unknown as string);
        FallbackMiddleware(context, () => undefined);
        expect(context.result.value).toContain('Sat Jan 01 2000 00:00:00');
        expect(context.result.fallingBack).toBe(true);
    });
});
