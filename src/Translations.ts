import { translate, translateDynamicProps } from './translate';

export type SimpleCompare = string;
// | "_"
// | `${">" | "<=" | "<" | ">=" | "="}${" " | ""}${number | ""}`;
export type numberOrEmpty = string; //`${`,${number}` | ""}`;
export type numberOrEmptyX5 = string; //`${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}`;
export type Contains = string; // `in [${number}${numberOrEmptyX5}${numberOrEmptyX5}]`;
//export type Between = `between ${number},${number}`;

export type PluralOptions = [
    SimpleCompare | Contains,
    string,
    ((val: number) => boolean)?
];
export type Plurals = { [key: string]: PluralOptions[] };
export interface Dictionary {
    [key: string]: string | DictionaryEntry | Dictionary;
}
export interface DictionaryEntry {
    value: string;
    plural?: Plurals;
    description?: string;
}

export class Translations {
    readonly dynamicCache: { [lang: string]: { [key: string]: string } } = {};
    readonly absent: { [key: string]: string } = {};
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

    translate(
        key: string | string[],
        dynamicProps?: translateDynamicProps,
        fallback?: string
    ) {
        return this.translateTo(this.defaultLang!, key, dynamicProps, fallback);
    }

    translateTo(
        lang: string,
        key: string | string[],
        dynamicProps?: translateDynamicProps,
        fallback?: string
    ): string {
        if (!lang) {
            lang = Object.keys(this.dictionaries)[0];
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

                fallbackCache:
                    this.fallbackLang && this.cacheDynamic
                        ? (this.dynamicCache[this.fallbackLang] =
                              this.dynamicCache[this.fallbackLang] || {})
                        : undefined,

                storeAbsent: this.storeAbsent ? this._storeAbsent : undefined,

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

    private _storeAbsent(key: string, fallback?: string) {
        this.absent[key] = fallback || '';
    }
}
