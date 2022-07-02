import { Dictionary, Translations } from '..';

describe('when extending existing dictionary', () => {
    let translations: Translations;

    beforeEach(() => {
        let dictionary: Dictionary = {
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
        };
        translations = new Translations(
            { 'en-US': dictionary },
            { lang: 'en-US' }
        );
    });

    it('should add new entry', () => {
        expect(translations.translate('test_test_${value}', { value: 1 })).toBe(
            'test_test_1'
        );
        translations.extendDictionary('en-US', {
            'test_test_${value}': 'test it: ${value}',
        });
        expect(translations.translate('test_test_${value}', { value: 1 })).toBe(
            'test it: 1'
        );
    });

    it('should replace an entry', () => {
        expect(translations.translate('test', { value: 1 })).toBe(
            'test: one test'
        );
        translations.extendDictionary('en-US', { test: 'test it: ${value}' });
        expect(translations.translate('test', { value: 1 })).toBe('test it: 1');
    });

    it('should add default translations', () => {
        expect(translations.hasTranslation('test_new')).toBeFalsy();
        translations.extendDictionary({ test_new: 'Test NEW' });
        expect(translations.hasTranslation('test_new')).toBeTruthy();
    });

    it('should "deeply" add entries', () => {
        expect(translations.translate('namespace.test_1')).toBe('Test One');
        expect(translations.translate('namespace.test_2')).toBe('Test Two');
        expect(translations.translate('namespace.namespace2.test_3')).toBe(
            'Test Tree'
        );
        expect(translations.translate('namespace.namespace2.test_6')).toBe(
            'Test Six'
        );
        expect(
            translations.hasTranslation('namespace.namespace2.test_4')
        ).toBeFalsy();

        translations.extendDictionary('en-US', {
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

        expect(translations.translate('namespace.test_1', { value: 1 })).toBe(
            'Test One'
        );
        expect(translations.translate('namespace.test_2', { value: 1 })).toBe(
            'Test Two new'
        );
        expect(translations.translate('namespace.namespace2.test_3')).toBe(
            'Test Tree'
        );
        expect(translations.translate('namespace.namespace3.test_4')).toBe(
            'Test Four'
        );
        expect(
            translations.translate('namespace.namespace2.namespace4.test_5')
        ).toBe('Test Five');
        expect(translations.translate('namespace.namespace2.test_6')).toBe(
            'Test Six New'
        );
    });
});

describe('when lang is not provided', () => {
    let translations: Translations;

    beforeEach(() => {
        translations = new Translations({});
    });

    it('should not provide translations', () => {
        expect(translations.hasTranslation('test_new')).toBeFalsy();
        translations.extendDictionary('test', { test_new: 'Test NEW' });
        expect(translations.hasTranslation('test_new')).toBeFalsy();
        expect(translations.hasTranslationTo('test', 'test_new')).toBeTruthy();
    });
});
