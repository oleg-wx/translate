import {
    Dictionaries,
    Dictionary,
    FailureCallback,
    SimpleDictionaries,
    TranslateDynamicProps,
    TranslateKey,
} from './core/types';
import { translate } from './translate';

export class Translations {
    readonly dynamicCache: SimpleDictionaries = {};
    readonly absent: { [key: string]: string[] } = {};
    $less = false;
    dictionaries: Dictionaries;
    storeAbsent: boolean;
    cacheDynamic: boolean;
    defaultLang: string | undefined;
    fallbackLang: string | undefined;
    onFailure: FailureCallback | undefined;

    constructor(
        dictionaries?: { [lang: string]: Dictionary },
        options?: {
            cacheDynamic?: boolean;
            storeAbsent?: boolean;
            defaultLang?: string;
            fallbackLang?: string;
            $less?: boolean;
            onFailure?: FailureCallback;
        }
    ) {
        this.dictionaries = dictionaries ?? {};
        this.cacheDynamic = !!options?.cacheDynamic;
        this.storeAbsent = !!options?.storeAbsent;
        this.defaultLang = options?.defaultLang;
        this.fallbackLang = options?.fallbackLang;
        this.onFailure = options?.onFailure;
        this.$less = options?.$less === true;
        // var a: DictionaryEntry = {
        //   value: "",
        //   plural: [">2", "string"],
        // };
    }

    translate(key: TranslateKey): string;
    translate(key: TranslateKey, fallback: string): string;
    translate(
        key: TranslateKey,
        dynamicProps?: TranslateDynamicProps,
        fallback?: string
    ): string;
    translate(
        key: TranslateKey,
        dynamicPropsOrFallback?: TranslateDynamicProps | string,
        fallback?: string
    ): string {
        return this.translateTo(
            this.defaultLang!,
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
        fallback?: string
    ): string;
    translateTo(
        lang: string,
        key: TranslateKey,
        dynamicPropsOrFallback?: TranslateDynamicProps | string,
        fallback?: string
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

        let result = translate(lang, this.dictionaries, key, dynamicProps, {
            dynamicCache: this.cacheDynamic
                ? this.dynamicCache
                : undefined,

            fallback,

            fallbackLang: this.fallbackLang,

            onFailure: this.onFailure,

            $less: this.$less,
        });

        return result;
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
