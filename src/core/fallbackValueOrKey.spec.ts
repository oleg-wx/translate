import { getFallbackValueOrKey } from "./fallbackValueOrKey"
import { TranslateKeyInstance } from "./translationKey";

describe('when getting fallback value or key',()=>{
    it('should get key if no fallback',()=>{
        expect(getFallbackValueOrKey(new TranslateKeyInstance('my-key'), undefined)).toBe('my-key');
        expect(getFallbackValueOrKey(new TranslateKeyInstance('my-namespace.my-key'), undefined)).toBe('my-namespace.my-key');
        expect(getFallbackValueOrKey(new TranslateKeyInstance(['my-namespace','my-key']), undefined)).toBe('my-namespace.my-key');
    });
    it('should get fallback when provided',()=>{
        expect(getFallbackValueOrKey(new TranslateKeyInstance('my-key'), 'my-fallback')).toBe('my-fallback');
    });
    it('should get empty string if key or fallback not provided',()=>{
        expect(getFallbackValueOrKey(undefined!, undefined)).toBe('');
    });
    it('should get string if number is provided',()=>{
        expect(getFallbackValueOrKey(new TranslateKeyInstance(10 as any as string), undefined)).toBe('10');
    });
    it('should get string if number is provided',()=>{
        expect(getFallbackValueOrKey(new TranslateKeyInstance({} as any as string), undefined)).toBe('[object Object]');
    });
})