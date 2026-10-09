import { Translations } from '..';

const LANG = 'en';
const KEY = 'i-ate-${bananas}';

/**
 * Builds a dictionary whose only plural rule uses `operator`, and returns a thunk that
 * translates it — operators are parsed lazily, so the error surfaces on translation.
 */
function translateWith(operator: string) {
    const translations = new Translations({
        [LANG]: {
            [KEY]: {
                value: 'I ate ${bananas}',
                plural: { bananas: [[operator, 'few bananas']] },
                description: 'translations',
            },
        },
    });

    return () => translations.translateTo(LANG, KEY, { bananas: 1 });
}

describe('when a plural rule uses an unparsable operator', () => {
    it.each(['between ', 'between a and b', 'between 3-4', 'between 1 4'])(
        'rejects malformed "between": "%s"',
        (operator) => {
            expect(translateWith(operator)).toThrowError(new Error(`wrong between format: "${operator}"`));
        }
    );

    it.each(['in []', 'in [1,2,3', 'in 4]'])('rejects malformed "in []": "%s"', (operator) => {
        expect(translateWith(operator)).toThrowError(new Error(`wrong array format: "${operator}"`));
    });

    it.each(['<=', '0', '>', '==', '[1,2,3]', '+', 'doit()'])(
        'rejects unsupported comparison: "%s"',
        (operator) => {
            expect(translateWith(operator)).toThrowError(new Error(`operator "${operator}" not supported`));
        }
    );
});
