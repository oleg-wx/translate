import { cldrOperator } from '../../operators/cldr.operators';

/**
 * The categories the operator claims. CLDR's sixth category, `other`, is deliberately not one of
 * them: `handlePluralize` accepts it as a synonym for `_` and never asks an operator about it.
 */
const CATEGORIES = ['zero', 'one', 'two', 'few', 'many'];

describe('CldrOperator.test', () => {
    it.each(CATEGORIES)('claims the category "%s"', (operation) => {
        expect(cldrOperator.test(operation)).toBe(true);
    });

    it.each([' one ', 'ONE', 'Few', '  MANY  ', 'Zero'])('is case and whitespace tolerant: "%s"', (operation) => {
        expect(cldrOperator.test(operation)).toBe(true);
    });

    it.each([
        { operation: '', why: 'empty' },
        { operation: '_', why: 'the default rule' },
        { operation: 'other', why: 'handled as the default rule, not an operator' },
        { operation: 'ones', why: 'not a category' },
        { operation: 'onetwo', why: 'two categories run together' },
        { operation: 'one two', why: 'two categories' },
        { operation: '= 1', why: 'a comparison' },
        { operation: 'in [1,2]', why: 'an array match' },
    ])('does not claim "$operation" ($why)', ({ operation }) => {
        expect(cldrOperator.test(operation)).toBe(false);
    });
});

describe('CldrOperator.exec', () => {
    it('throws when handed something that is not a category', () => {
        expect(() => cldrOperator.exec('nope')).toThrowError(new Error('wrong CLDR format: "nope"'));
    });

    /**
     * Ground truth is `Intl.PluralRules` itself. A language only ever matches the categories CLDR
     * gives it: `en` has just one/other, `ru` adds few/many, `ar` and `cy` use all six. Each row
     * asserts the expected category matches *and* that every other category rejects the value.
     */
    describe.each([
        {
            locale: 'en',
            has: 'one, other',
            expectations: [
                { value: -1, category: 'one' }, // CLDR compares magnitude, so -1 is `one`
                { value: 0, category: undefined }, // `other` — no operator claims it
                { value: 1, category: 'one' },
                { value: 2, category: undefined },
                { value: 11, category: undefined },
                { value: 100, category: undefined },
            ],
        },
        {
            locale: 'ru',
            has: 'one, few, many, other',
            expectations: [
                { value: 0, category: 'many' },
                { value: 1, category: 'one' },
                { value: 2, category: 'few' },
                { value: 3, category: 'few' },
                { value: 5, category: 'many' },
                { value: 11, category: 'many' },
                { value: 21, category: 'one' },
                { value: 100, category: 'many' },
                { value: 121, category: 'one' },
            ],
        },
        {
            locale: 'ar',
            has: 'all six',
            expectations: [
                { value: 0, category: 'zero' },
                { value: 1, category: 'one' },
                { value: 2, category: 'two' },
                { value: 3, category: 'few' },
                { value: 6, category: 'few' },
                { value: 11, category: 'many' },
                { value: 100, category: undefined }, // `other`
            ],
        },
        {
            locale: 'cy',
            has: 'all six',
            expectations: [
                { value: 0, category: 'zero' },
                { value: 1, category: 'one' },
                { value: 2, category: 'two' },
                { value: 3, category: 'few' },
                { value: 6, category: 'many' },
                { value: 5, category: undefined }, // `other`
            ],
        },
    ])('$locale ($has)', ({ locale, expectations }) => {
        it.each(expectations)('$value is "$category" and no other category', ({ value, category }) => {
            const matched = CATEGORIES.filter((c) => cldrOperator.exec(c)(value, locale));

            expect(matched).toEqual(category ? [category] : []);
        });
    });

    // `ar` is used below because it has all six categories, so a match is always meaningful.
    describe('value coercion', () => {
        it.each(['abc', 'not a number', {}, undefined])('matches no category for %p, which is NaN', (value) => {
            CATEGORIES.forEach((category) => {
                expect(cldrOperator.exec(category)(value as never, 'ar')).toBe(false);
            });
        });

        it.each([
            { value: '2', category: 'two' },
            { value: true, category: 'one' },
            { value: '', category: 'zero' },
            { value: false, category: 'zero' },
        ])('coerces $value to a number and matches "$category"', ({ value, category }) => {
            expect(cldrOperator.exec(category)(value as never, 'ar')).toBe(true);
        });
    });

    describe('locale handling', () => {
        it.each([undefined, ''])('rejects rather than guessing when the locale is %p', (locale) => {
            // Guessing would mean falling back to the runtime default locale, making the
            // result depend on the machine the code runs on.
            expect(cldrOperator.exec('one')(1, locale)).toBe(false);
        });

        it.each(['main', 'test', 'not a tag'])('throws for the structurally invalid locale "%s"', (locale) => {
            expect(() => cldrOperator.exec('one')(1, locale)).toThrowError(
                new Error(`invalid locale for CLDR: "${locale}"`)
            );
        });

        it('is not order-dependent: a bad locale never poisons a good one', () => {
            expect(cldrOperator.exec('one')(1, 'en')).toBe(true);
            expect(cldrOperator.exec('one')(1, undefined)).toBe(false);
            expect(() => cldrOperator.exec('one')(1, 'main')).toThrow();
            expect(cldrOperator.exec('one')(1, 'en')).toBe(true);
        });

        it('memoises rules per locale without mixing them up', () => {
            const few = cldrOperator.exec('few');

            // 3 is `few` in Russian but has no category in English.
            expect(few(3, 'ru')).toBe(true);
            expect(few(3, 'en')).toBe(false);
            expect(few(3, 'ru')).toBe(true);
        });
    });
});
