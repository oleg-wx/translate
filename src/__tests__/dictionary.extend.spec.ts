import { Dictionary, Translations } from '..';

const LANG = 'en-US';

const createDictionary = (): Dictionary => ({
    test: {
        value: 'test: ${value}',
        plural: {
            value: [
                ['= 0', 'none'],
                ['= 1', 'one test'],
                ['_', '$# tests'],
            ],
        },
    },
    namespace: {
        test_1: 'Test One',
        test_2: 'Test Two',
        namespace2: {
            test_3: 'Test Tree',
            test_6: 'Test Six',
        },
    },
});

describe('when extending an existing dictionary', () => {
    let translations: Translations;

    beforeEach(() => {
        // `extendDictionary` mutates the dictionary in place, so each test needs its own copy.
        translations = new Translations({ [LANG]: createDictionary() }, { lang: LANG });
    });

    it('adds a new entry', () => {
        expect(translations.translate('test_test_${value}', { value: 1 })).toBe('test_test_1');

        translations.extendDictionary(LANG, { 'test_test_${value}': 'test it: ${value}' });

        expect(translations.translate('test_test_${value}', { value: 1 })).toBe('test it: 1');
    });

    it('replaces an existing entry, dropping its plurals', () => {
        expect(translations.translate('test', { value: 1 })).toBe('test: one test');

        translations.extendDictionary(LANG, { test: 'test it: ${value}' });

        expect(translations.translate('test', { value: 1 })).toBe('test it: 1');
    });

    it('defaults to the current lang when none is given', () => {
        expect(translations.hasTranslation('test_new')).toBeFalsy();

        translations.extendDictionary({ test_new: 'Test NEW' });

        expect(translations.hasTranslation('test_new')).toBeTruthy();
    });

    describe('merging nested namespaces', () => {
        beforeEach(() => {
            translations.extendDictionary(LANG, {
                namespace: {
                    test_2: 'Test Two new',
                    namespace3: {
                        test_4: 'Test Four',
                    },
                    namespace2: {
                        test_6: 'Test Six New',
                        namespace4: {
                            test_5: 'Test Five',
                        },
                    },
                },
            });
        });

        it.each([
            { key: 'namespace.test_1', expected: 'Test One', why: 'untouched entry survives' },
            { key: 'namespace.test_2', expected: 'Test Two new', why: 'existing entry is overwritten' },
            { key: 'namespace.namespace2.test_3', expected: 'Test Tree', why: 'untouched nested entry survives' },
            { key: 'namespace.namespace2.test_6', expected: 'Test Six New', why: 'nested entry is overwritten' },
            { key: 'namespace.namespace3.test_4', expected: 'Test Four', why: 'new sibling namespace is added' },
            {
                key: 'namespace.namespace2.namespace4.test_5',
                expected: 'Test Five',
                why: 'new deeply nested namespace is added',
            },
        ])('$why: $key → "$expected"', ({ key, expected }) => {
            expect(translations.translate(key)).toBe(expected);
        });
    });

    it('reports a missing nested key before it is added', () => {
        expect(translations.hasTranslation('namespace.namespace2.test_4')).toBeFalsy();
    });
});

describe('when extending a dictionary for a lang that is not the current one', () => {
    it('is reachable through hasTranslationTo but not hasTranslation', () => {
        const translations = new Translations({});

        translations.extendDictionary('test', { test_new: 'Test NEW' });

        expect(translations.hasTranslation('test_new')).toBeFalsy();
        expect(translations.hasTranslationTo('test', 'test_new')).toBeTruthy();
    });
});
