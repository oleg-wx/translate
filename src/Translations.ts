import { Dictionary, TranslateDynamicProps, TranslateKey } from './core/types';
import { translate } from './translate';

export class Translations {
    readonly dynamicCache: { [lang: string]: { [key: string]: string } } = {};
    readonly absent: { [key: string]: string[] } = {};
    $less = false;
    dictionaries: { [lang: string]: Dictionary };
    storeAbsent: boolean;
    cacheDynamic: boolean;
    defaultLang: string | undefined;
    fallbackLang: string | undefined;

    constructor(
        dictionaries?: { [lang: string]: Dictionary },
        options?: {
            cacheDynamic?: boolean;
            storeAbsent?: boolean;
            defaultLang?: string;
            fallbackLang?: string;
            $less?: boolean;
        }
    ) {
        this.dictionaries = dictionaries || {};
        this.cacheDynamic = !!options?.cacheDynamic;
        this.storeAbsent = !!options?.storeAbsent;
        this.defaultLang = options?.defaultLang;
        this.fallbackLang = options?.fallbackLang;
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

        let dynamicProps = dynamicPropsOrFallback as { [key: string]: string } | undefined;
        if (
            dynamicPropsOrFallback &&
            typeof dynamicPropsOrFallback === 'string'
        ) {
            dynamicProps = undefined;
            fallback = dynamicPropsOrFallback;
        }

        let result = translate(
            this.dictionaries ? this.dictionaries[lang] : undefined,
            key,
            dynamicProps,
            {
                dynamicCache: this.cacheDynamic
                    ? (this.dynamicCache[lang] = this.dynamicCache[lang] || {})
                    : undefined,

                fallback,

                fallbackDictionary: this.fallbackLang
                    ? this.dictionaries[this.fallbackLang]
                    : undefined,

                absentCache: this.storeAbsent
                    ? (this.absent[lang] = this.absent[lang] || [])
                    : undefined,

                $less: this.$less,
            }
        );

        return result;
    }

    extendDictionary(lang: string, dictionary: Dictionary) {
        this.dictionaries = this.dictionaries || {};
        let existingDictionary = this.dictionaries[lang];

        if (existingDictionary) {
            Object.assign(existingDictionary, dictionary);
        } else {
            this.dictionaries[lang] = dictionary;
        }
    }
}
