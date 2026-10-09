import { FallbackMiddleware } from '../../middleware/fallback-middleware';
import { createContext } from '../_helpers/create-context';

describe('FallbackMiddleware', () => {
    describe('with no fallback value, it falls back to the key', () => {
        it.each([
            { key: 'my-key', expected: 'my-key', shape: 'a plain key' },
            { key: 'my-namespace.my-key', expected: 'my-namespace.my-key', shape: 'a dotted key' },
            { key: ['my-namespace', 'my-key'], expected: 'my-namespace.my-key', shape: 'an array key' },
        ])('$shape → "$expected"', ({ key, expected }) => {
            const context = createContext(key);

            FallbackMiddleware(context);

            expect(context.result.value).toBe(expected);
            expect(context.result.fallingBack).toBe(true);
            expect(context.result.fallingBackToKey).toBe(true);
        });
    });

    describe('it stringifies whatever the key happens to be', () => {
        it.each([
            { key: undefined!, expected: '', shape: 'undefined' },
            { key: 10 as unknown as string, expected: '10', shape: 'a number' },
            { key: {} as unknown as string, expected: '[object Object]', shape: 'an object' },
        ])('$shape → "$expected"', ({ key, expected }) => {
            const context = createContext(key);

            FallbackMiddleware(context);

            expect(context.result.value).toBe(expected);
            expect(context.result.fallingBack).toBe(true);
        });

        it('a Date', () => {
            const context = createContext(new Date(2000, 0, 1) as unknown as string);

            FallbackMiddleware(context);

            expect(context.result.value).toContain('Sat Jan 01 2000 00:00:00');
            expect(context.result.fallingBack).toBe(true);
        });
    });

    it('prefers a fallback string over the key', () => {
        const context = createContext('my-key', { fallback: 'my-fallback' });

        FallbackMiddleware(context);

        expect(context.result.value).toBe('my-fallback');
        expect(context.result.fallingBack).toBe(true);
        expect(context.result.fallingBackToKey).toBeUndefined();
    });

    it('takes value, plurals and cases from a fallback entry', () => {
        const fallback = {
            value: 'my ${count}',
            plural: { count: [['=1', 'one'] as [string, string]] },
            cases: { count: [['!!', 'some'] as [string, string]] },
        };
        const context = createContext('my-key', { fallback });

        FallbackMiddleware(context);

        expect(context.result.value).toBe('my ${count}');
        expect(context.result.plurals).toBe(fallback.plural);
        expect(context.result.cases).toBe(fallback.cases);
        expect(context.result.entry).toBe(fallback);
        expect(context.result.fallingBackToKey).toBeUndefined();
    });

    it('leaves an already resolved value untouched', () => {
        const context = createContext('my-key', { fallback: 'my-fallback' });
        context.result.value = 'translated';

        FallbackMiddleware(context);

        expect(context.result.value).toBe('translated');
        expect(context.result.fallingBack).toBeUndefined();
    });
});
