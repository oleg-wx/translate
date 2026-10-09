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
import { deepAssign } from './core/deep-assign';

export class Translations {
    pipeline: Pipeline;

    placeholder?: PlaceholderType;
    dictionaries: Dictionaries;
    lang: string | undefined;
    fallbackLang: string | undefined;

    constructor(
        dictionaries?: Dictionaries,
        options?: {
            lang?: string;
            fallbackLang?: string;
            placeholder?: PlaceholderType;
        },
        pipeline?: Pipeline
    ) {
        this.dictionaries = dictionaries ?? {};
        this.lang = options?.lang;
        this.fallbackLang = options?.fallbackLang;
        this.placeholder = options?.placeholder;
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
        fallback?: DictionaryEntry | string
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
            lang = '';
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
        return hasTranslation(lang, this.dictionaries, key);
    }

    hasTranslation(key: TranslateKey): boolean {
        return hasTranslation(this.lang as string, this.dictionaries, key);
    }

    extendDictionary(lang: string, dictionary: Dictionary): void;
    extendDictionary(dictionary: Dictionary): void;
    extendDictionary(
        langOrDictionary: string | Dictionary,
        dictionary?: Dictionary
    ): void {
        let lang: string | undefined;
        if (typeof langOrDictionary === 'string') {
            lang = langOrDictionary;
        } else {
            lang = this.lang;
            dictionary = langOrDictionary;
        }
        if (!lang || !dictionary) {
            return;
        }

        this.dictionaries = this.dictionaries ?? {};
        let existingDictionary = this.dictionaries[lang];

        if (existingDictionary) {
            deepAssign(existingDictionary, dictionary);
        } else {
            this.dictionaries[lang] = dictionary;
        }
    }
}
