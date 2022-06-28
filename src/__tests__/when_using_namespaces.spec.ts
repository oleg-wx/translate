import { Dictionary, Translations } from '..';

describe('when using namespaces', () => {
    let dictionary: Dictionary = {
        'will.not.work': 'nope',
        item: {
            test: {
                value: 'test: ${num}',
                plural: {
                    num: [
                        ['= 0', 'none'],
                        ['= 1', 'one test'],
                        ['= 100', '$&{onehundred} tests'],
                        ['= 200', '$&{item.twohundred} tests'],
                        ['_', '$# tests'],
                    ],
                },
            },
            twohundred: 'Two Hundred',
        },
        onehundred: {
            value: 'One Hundred',
        },
    };
    const translations = new Translations(
        { 'en-US': dictionary },
        { cacheDynamic: false, lang: 'en-US' }
    );

    it('should use value from namespace', () => {
        const translated = translations.translate('item.test', {
            num: 105,
        });
        expect(translated).toBe('test: 105 tests');
    });

    it('should use value from namespace and placeholder from global', () => {
        const translated = translations.translate('item.test', {
            num: 100,
        });
        expect(translated).toBe('test: One Hundred tests');
    });

    it('should use value from namespace and placeholder from namespace', () => {
        const translated = translations.translate('item.test', {
            num: 200,
        });
        expect(translated).toBe('test: Two Hundred tests');
    });

    it('should not get the value when key contains namespace separators', () => {
      const translated = translations.translate('will.not.work');
      expect(translated).not.toBe('nope');
      expect(translated).toBe('will.not.work');
  });
});
