import { SimplePipeline } from '../core/middleware/simple-pipeline';
import { MiddlewareStatic } from '../core/types';
import { Translations } from '../Translations';

describe('when using custom middleware', () => {
    let key = 'i-ate-${eggs}-${bananas}-dinner';
    const pipeline = new SimplePipeline();
    pipeline.addMiddleware((context) => {
        const { params, result } = context;
        if (result.fallingBack) {
            console.warn(`the value for ${params.key} is not translated`);
            result.value = `!WARNING: ${result.value} [${params.key}]`;
        } else {
            result.value = `${result.value}: YAY!`;
        }
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

describe('when using custom middleware static', () => {
    let key = 'i-ate-${eggs}-${bananas}-dinner';
    const pipeline = new SimplePipeline();
    const mv: MiddlewareStatic & { count: number } = {
        count: 0,
        exec(context) {
            mv.count = (mv.count ?? 0) + 1;
        },
    };
    pipeline.addMiddleware(mv);
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
        { lang: 'en' },
        pipeline
    );
    let values = [
        { key, bananas: 1 },
        { key, bananas: 0 },
        { key, bananas: 3 },
    ];
    it(`should call static middleware`, () => {
        values.forEach((v, i) => {
            translations.translate(v.key, v);
        });
        expect(mv.count).toBe(3);
    });
});

describe('should detect fallbacks to key or value', () => {
    const pipeline = new SimplePipeline();
    const mv: MiddlewareStatic & { keyFallbacks: number; fallbacks: number } = {
        keyFallbacks: 0,
        fallbacks: 0,
        exec(context) {
            if (context.result.fallingBack) {
                mv.fallbacks++;
                if (context.result.fallingBackToKey) {
                    mv.keyFallbacks++;
                }
            }
        },
    };
    pipeline.addMiddleware(mv);
    let translations = new Translations(
        {
            en: { yes: 'Yes' },
        },
        { lang: 'en' },
        pipeline
    );
    let values = [
        { key: 'no', fallback: 'fallback' },
        { key: 'no', fallback: undefined },
        { key: 'yes', fallback: 'fallback' },
        { key: 'yes', fallback: undefined },
    ];

    it(`should detect key fallbacks`, () => {
        values.forEach((v) => {
            translations.translate(v.key, v.fallback!);
        });
        expect(mv.fallbacks).toBe(2);
        expect(mv.keyFallbacks).toBe(1);
    });
});
