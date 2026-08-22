import { Dictionaries, MiddlewareStatic, SimplePipeline, Translations } from '..';

const KEY = 'i-ate-${eggs}-${bananas}-dinner';

const DICTIONARIES: Dictionaries = {
    en: {
        [KEY]: {
            value: 'I ate ${bananas} for dinner',
            plural: {
                bananas: [
                    ['< 1', 'no bananas'],
                    ['= 1', 'one banana'],
                    ['> 1', '$# bananas'],
                ],
            },
            description: 'translations',
        },
    },
};

describe('when a custom middleware rewrites the result', () => {
    const pipeline = new SimplePipeline();
    pipeline.addMiddleware(({ params, result }) => {
        result.value = result.fallingBack ? `!WARNING: ${result.value} [${params.key}]` : `${result.value}: YAY!`;
    });

    const translations = new Translations(DICTIONARIES, undefined, pipeline);

    it.each([
        { bananas: 1, expected: 'I ate one banana for dinner: YAY!' },
        { bananas: 0, expected: 'I ate no bananas for dinner: YAY!' },
        { bananas: 3, expected: 'I ate 3 bananas for dinner: YAY!' },
    ])('marks a translated value: $bananas bananas → "$expected"', ({ bananas, expected }) => {
        expect(translations.translateTo('en', KEY, { bananas })).toBe(expected);
    });

    it('marks a value that fell back', () => {
        expect(translations.translateTo('en', 'not', { bananas: 3 }, 'not there ${bananas}')).toBe(
            '!WARNING: not there 3 [not]'
        );
    });
});

describe('when a custom middleware is a static object', () => {
    it('is executed once per translation', () => {
        const middleware: MiddlewareStatic & { count: number } = {
            count: 0,
            exec() {
                middleware.count++;
            },
        };

        const pipeline = new SimplePipeline();
        pipeline.addMiddleware(middleware);
        const translations = new Translations(DICTIONARIES, { lang: 'en' }, pipeline);

        [1, 0, 3].forEach((bananas) => translations.translate(KEY, { bananas }));

        expect(middleware.count).toBe(3);
    });
});

describe('when a middleware inspects how the value was resolved', () => {
    it('reports fallingBack for a missing key and fallingBackToKey only without a fallback value', () => {
        const seen: { fallbacks: number; keyFallbacks: number } = { fallbacks: 0, keyFallbacks: 0 };

        const pipeline = new SimplePipeline();
        pipeline.addMiddleware(({ result }) => {
            if (!result.fallingBack) {
                return;
            }
            seen.fallbacks++;
            if (result.fallingBackToKey) {
                seen.keyFallbacks++;
            }
        });
        const translations = new Translations({ en: { yes: 'Yes' } }, { lang: 'en' }, pipeline);

        translations.translate('no', 'fallback'); // missing key, fallback given  → fallingBack
        translations.translate('no'); // missing key, no fallback     → fallingBack + toKey
        translations.translate('yes', 'fallback'); // translated
        translations.translate('yes'); // translated

        expect(seen.fallbacks).toBe(2);
        expect(seen.keyFallbacks).toBe(1);
    });
});
