import { getFallbackValueOrKey } from "./fallbackValueOrKey"
import { TranslationKey } from "./translationKey";

describe('when getting fallback value or key',()=>{
    it('should get key if no fallback',()=>{
        expect(getFallbackValueOrKey(new TranslationKey('my-key'), undefined,undefined)).toBe('my-key');
        expect(getFallbackValueOrKey(new TranslationKey('my-namespace.my-key'), undefined,undefined)).toBe('my-namespace.my-key');
        expect(getFallbackValueOrKey(new TranslationKey(['my-namespace','my-key']), undefined,undefined)).toBe('my-namespace.my-key');
    });
    it('should get fallback when provided',()=>{
        expect(getFallbackValueOrKey(new TranslationKey('my-key'), 'my-fallback',undefined)).toBe('my-fallback');
    });
    it('should get empty string if key or fallback not provided',()=>{
        expect(getFallbackValueOrKey(undefined!, undefined,undefined)).toBe('');
    });
    it('should get string if number is provided',()=>{
        expect(getFallbackValueOrKey(new TranslationKey(10 as any as string), undefined,undefined)).toBe('10');
    });
    it('should get string if number is provided',()=>{
        expect(getFallbackValueOrKey(new TranslationKey({} as any as string), undefined,undefined)).toBe('[object Object]');
    });
})