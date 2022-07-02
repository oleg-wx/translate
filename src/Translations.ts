import {
    Dictionaries,
    Dictionary,
    DictionaryEntry,
    Pipeline,
    PlaceholderType,
    SimpleDictionaries,
    TranslateDynamicProps,
    TranslateKey,
} from './core/types';
import { SimpleDefaultPipeline } from './core/middleware/simple-pipeline';
import { translate, hasTranslation } from './translate';

export class Translations {
    pipeline: Pipeline;

    placeholder?: PlaceholderType;
    dictionaries: Dictionaries;
    lang: string | undefined;
    fallbackLang: string | undefined;

    /**
     * @deprecated defaultLang will be removed. Use lang instead.
     */
    get defaultLang() {
        return this.lang;
    }
    set defaultLang(val: string | undefined) {
        this.lang = val;
    }

    /**
     * @deprecated $less will be removed. Use placeholder='singe' instead.
     */
    get $less() {
        return this.placeholder ? this.placeholder === 'single' : undefined;
    }
    set $less(val: boolean | undefined) {
        this.placeholder =
            val === undefined ? undefined : val ? 'single' : 'default';
    }

    constructor(
        dictionaries?: Dictionaries,
        options?: {
            lang?: string;
            /**
             * @deprecated defaultLang will be removed. Use lang instead
             */
            defaultLang?: string;
            fallbackLang?: string;
            placeholder?: PlaceholderType;
            /**
             * @deprecated $less will be removed. Use placeholder='singe' instead.
             */
            $less?: boolean;
        },
        pipeline?: Pipeline
    ) {
        this.dictionaries = dictionaries ?? {};
        this.lang = options?.lang ?? options?.defaultLang;
        this.fallbackLang = options?.fallbackLang;
        this.placeholder =
            options?.placeholder ?? (options?.$less ? 'single' : undefined);
        if (pipeline) {
            this.pipeline = pipeline;
        } else {
            this.pipeline = new SimpleDefaultPipeline();
        }
    }

    translate(key: TranslateKey): string;
    translate(key: TranslateKey, fallback: string): string;
    translate(
        key: TranslateKey,
        dynamicProps?: TranslateDynamicProps,
        fallback?: DictionaryEntry | string
    ): string;
    translate(
        key: TranslateKey,
        dynamicPropsOrFallback?: TranslateDynamicProps | string,
        fallback?: DictionaryEntry |string
    ): string {
        return this.translateTo(
            this.lang!,
            key,
            dynamicPropsOrFallback as TranslateDynamicProps,
            fallback as string
        );
    }

    translateTo(lang: string, key: TranslateKey): string;
    translateTo(lang: string, key: TranslateKey, fallback: string): string;
    translateTo(
        lang: string,
        key: TranslateKey,
        dynamicProps: TranslateDynamicProps,
        fallback?: DictionaryEntry | string
    ): string;
    translateTo(
        lang: string,
        key: TranslateKey,
        dynamicPropsOrFallback?: TranslateDynamicProps | string,
        fallback?: DictionaryEntry | string
    ): string {
        if (!lang) {
            lang = Object.keys(this.dictionaries)[0];
        }

        let dynamicProps = dynamicPropsOrFallback as
            | { [key: string]: string }
            | undefined;
        if (
            dynamicPropsOrFallback &&
            typeof dynamicPropsOrFallback === 'string'
        ) {
            dynamicProps = undefined;
            fallback = dynamicPropsOrFallback;
        }

        let result = translate(
            this.pipeline,
            lang,
            this.dictionaries,
            key,
            dynamicProps,
            fallback,
            {
                fallbackLang: this.fallbackLang,

                placeholder: this.placeholder,
            }
        );

        return result;
    }

    hasTranslationTo(lang: string, key: TranslateKey): boolean {
        return hasTranslation(lang as string, this.dictionaries, key);
    }

    hasTranslation(key: TranslateKey): boolean {
        return hasTranslation(this.lang as string, this.dictionaries, key);
    }

    extendDictionary(lang: string, dictionary: Dictionary) {
        this.dictionaries = this.dictionaries ?? {};
        let existingDictionary = this.dictionaries[lang];

        if (existingDictionary) {
            Object.assign(existingDictionary, dictionary);
        } else {
            this.dictionaries[lang] = dictionary;
        }
    }
}
