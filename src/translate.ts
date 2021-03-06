import {
    TranslateKey,
    Dictionaries,
    SimpleDictionaries,
    TranslateDynamicProps,
    Context,
    Pipeline,
    FallbackLangParams,
    PlaceholderParams,
    DictionaryEntry,
    TranslateOptions,
} from './core/types';
import { TranslateKeyInstance } from './core/translation-key';
import { SimpleDefaultPipeline } from './core/middleware/simple-pipeline';
import { GetEntryMiddleware } from './core/middleware/get-entry-middleware';

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
    fallback?: DictionaryEntry | string,
    settings?: TranslateOptions
): string {
    if (key == null || key == '' || key.length === 0) {
        return '';
    }

    return pipeline.run<PlaceholderParams & FallbackLangParams>({
        dictionaries: dictionaries,
        lang,
        key: new TranslateKeyInstance(key),
        dynamicProps,
        fallback: fallback,
        data: {
            fallbackLang: settings?.fallbackLang,
            placeholder: settings?.placeholder,
        },
    });
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
    GetEntryMiddleware(context);
    return !!context.result.value;
}
