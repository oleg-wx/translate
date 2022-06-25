import {
    TranslateKey,
    Dictionaries,
    SimpleDictionaries,
    TranslateDynamicProps,
    TranslateInternalSettings,
    Context,
    Pipeline,
} from './core/types';
import globalSettings from './core/globalSettings';
import { TranslateKeyInstance } from './core/translationKey';
import { SimpleDefaultPipeline } from './core/middleware/simplePipeline';
import { GetEntryMiddleware } from './core/middleware/getEntryMiddleware';

export interface TranslateOptions extends Partial<TranslateInternalSettings> {
    fallbackLang?: string;
    dynamicCache?: SimpleDictionaries;
}

/**
 *
 * @param dictionary - Dictionary to use to translate
 * @param key - translation key
 * @param dynamicProps - object to use for placeholders
 * @param settings - options
 * @returns
 */
export function translate(
    pipeline: Pipeline,
    lang: string,
    dictionaries: Dictionaries,
    key: TranslateKey,
    dynamicProps?: TranslateDynamicProps,
    fallback?: string,
    settings?: TranslateOptions
): string {
    if (key == null || key == '' || key.length === 0) {
        return '';
    }

    return pipeline.run(
        {
            dictionaries: dictionaries,
            lang,
            key: new TranslateKeyInstance(key),
            dynamicCache: settings?.dynamicCache,
            dynamicProps,
            fallback: fallback,
            data: {
                fallbackLang: settings?.fallbackLang,
            },
        },
        {
            $less:
                settings?.$less !== undefined
                    ? settings?.$less
                    : globalSettings.$less,
        }
    );
}

export function hasTranslation(
    lang: string,
    dictionaries: Dictionaries,
    key: TranslateKey
) {
    const context: Context = {
        params: { key: new TranslateKeyInstance(key), lang, dictionaries },
        result: {},
    };
    GetEntryMiddleware(context, () => undefined);
    return !!context.result.value;
}
