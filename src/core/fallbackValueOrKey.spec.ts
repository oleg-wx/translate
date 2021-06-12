import { getFallbackValueOrKey } from "./fallbackValueOrKey"

describe('when getting fallback value or key',()=>{
    it('should get key if no fallback',()=>{
        expect(getFallbackValueOrKey('my-key', undefined,undefined)).toBe('my-key');
        expect(getFallbackValueOrKey('my-namespace:my-key', undefined,undefined)).toBe('my-namespace:my-key');
        expect(getFallbackValueOrKey(['my-namespace','my-key'], undefined,undefined)).toBe('my-namespace:my-key');
    });
    it('should get fallback when provided',()=>{
        expect(getFallbackValueOrKey('my-key', 'my-fallback',undefined)).toBe('my-fallback');
    });
    it('should get empty string if key or fallback not provided',()=>{
        expect(getFallbackValueOrKey(undefined!, undefined,undefined)).toBe('');
    });
    it('should get string if number is provided',()=>{
        expect(getFallbackValueOrKey(10 as any as string, undefined,undefined)).toBe('10');
    });
    it('should get string if number is provided',()=>{
        expect(getFallbackValueOrKey({} as any as string, undefined,undefined)).toBe('[object Object]');
    });
})