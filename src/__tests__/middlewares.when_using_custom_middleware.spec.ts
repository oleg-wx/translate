import { SimplePipeline } from '../core/middleware/simplePipeline';
import { Translations } from '../Translations';

describe('when using custom middleware', () => {
    let key = 'i-ate-${eggs}-${bananas}-dinner';
    const pipeline = new SimplePipeline();
    pipeline.addMiddleware((context, next) => {
        const { params, result } = context;
        if (result.fallingBack) {
            console.warn(`the value for ${params.key} is not translated`);
            result.value = `!WARNING: ${result.value} [${params.key}]`;
        } else {
            result.value = `${result.value}: YAY!`;
        }
        next();
    });
    let translations = new Translations(
        {
            en: {
                [key]: {
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
        },
        undefined,
        pipeline
    );

    let values = [
        { key, bananas: 1 },
        { key, bananas: 0 },
        { key, bananas: 3 },
        { key: 'not', bananas: 3, fallback: 'not there ${bananas}' },
    ];

    let expectedEn = [
        'I ate one banana for dinner: YAY!',
        'I ate no bananas for dinner: YAY!',
        'I ate 3 bananas for dinner: YAY!',
        '!WARNING: not there 3 [not]',
    ];

    values.forEach((v, i) => {
        it(`should build ${v.bananas} => ${expectedEn[i]}`, () => {
            expect(translations.translateTo('en', v.key, v, v.fallback)).toBe(
                expectedEn[i]
            );
        });
    });
});
