import {
    SimpleDefaultPipeline,
    SimplePipeline,
} from '../core/middleware/simple-pipeline';
import {
    Context,
    FallbackLangParams,
    FallbackLangResult,
    MiddlewareStatic,
} from '../core/types';
import { Translations } from '../Translations';

describe('when using fallback to lang middleware', () => {
    const pipeline = new SimpleDefaultPipeline();

    let res: {
        fallback?: boolean;
        fallbackLang?: string;
    };

    pipeline.addMiddleware((context: Context<FallbackLangResult>) => {
        const { params, result } = context;
        if (result.fallingBack) {
            res.fallback = result.fallingBack;
        }
        if (result.fallingBackLang) {
            res.fallbackLang = result.fallingBackLang;
        }
    });
    let translations = new Translations(
        {
            en: {
                key: 'translated',
            },
            fallback: {
                key_fb: 'translated_fb',
            },
        },
        { lang: 'en', fallbackLang: 'fallback' },
        pipeline
    );

    beforeEach(() => {
        res = {};
    });

    it(`should translate`, () => {
        expect(translations.translate('key', 'fallback')).toBe('translated');
        expect(res.fallback).toBeFalsy();
        expect(res.fallbackLang).toBeFalsy();
    });

    it(`should fallback to lang`, () => {
        expect(translations.translate('key_fb', 'fallback')).toBe(
            'translated_fb'
        );
        expect(res.fallback).toBeTruthy();
        expect(res.fallbackLang).toBeTruthy();
    });

    it(`should fallback`, () => {
        expect(translations.translate('fb', 'fallback')).toBe('fallback');
        expect(res.fallback).toBeTruthy();
    });
});
