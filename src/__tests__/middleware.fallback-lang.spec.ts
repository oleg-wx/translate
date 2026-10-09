import { SimpleDefaultPipeline, Translations } from '..';
import { Context, FallbackLangResult } from '../core/types';

describe('when using the fallback-to-lang middleware', () => {
    let observed: { fallingBack?: boolean; fallingBackLang?: string };
    let translations: Translations;

    beforeEach(() => {
        observed = {};

        const pipeline = new SimpleDefaultPipeline();
        pipeline.addMiddleware(({ result }: Context<FallbackLangResult>) => {
            observed.fallingBack = result.fallingBack;
            observed.fallingBackLang = result.fallingBackLang;
        });

        translations = new Translations(
            {
                en: { key: 'translated' },
                fallback: { key_fb: 'translated_fb' },
            },
            { lang: 'en', fallbackLang: 'fallback' },
            pipeline
        );
    });

    it('reports nothing when the active lang has the key', () => {
        expect(translations.translate('key', 'fallback')).toBe('translated');
        expect(observed.fallingBack).toBeFalsy();
        expect(observed.fallingBackLang).toBeFalsy();
    });

    it('reports the language it fell back to', () => {
        expect(translations.translate('key_fb', 'fallback')).toBe('translated_fb');
        expect(observed.fallingBack).toBeTruthy();
        expect(observed.fallingBackLang).toBe('fallback');
    });

    it('reports a plain fallback when no language has the key', () => {
        expect(translations.translate('fb', 'fallback')).toBe('fallback');
        expect(observed.fallingBack).toBeTruthy();
        expect(observed.fallingBackLang).toBeFalsy();
    });
});
