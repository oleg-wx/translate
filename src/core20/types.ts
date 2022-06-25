import { TranslateKeyInstance } from './translationKey';

export interface ContextParams<TData = any> {
    dictionaries: Dictionaries;
    key: TranslateKeyInstance;
    lang: string;
    dynamicProps?: TranslateDynamicProps;
    fallback?: string;
    dynamicCache?: SimpleDictionaries;
    data?: TData;
}

export interface ContextBaseResult {
    entry?: DictionaryValue;
    value?: string;
    plural?: Plurals;
    fallingBack?: boolean;
}

export interface Context<T = {}, TParamsData = any> {
    params: ContextParams<TParamsData>;
    result: ContextBaseResult & T;
    settings?: TranslateInternalSettings;
    translate?: SimpleTranslateFunc;
}

export interface CachedResult {
    dynamicKey: string;
    fromCache: boolean;
}

export interface FallbackLangParams {
    fallbackLang?: string;
}

export type TranslateKey = string | string[];

export interface DictionaryEntry {
    value: string;
    plural?: Plurals;
    description?: string;
}

export type DictionaryValue = string | DictionaryEntry | Dictionary;

export interface Dictionary {
    [key: string]: DictionaryValue;
    // | { [key: string]: any };
}

export interface Dictionaries {
    [lang: string]: Dictionary;
}

export interface TranslateInternalSettings {
    $less: boolean;
}

export type TranslateDynamicProps = {
    [key: string]: string | number | undefined;
};
export type SimpleCompare = string;
// | "_"
// | `${">" | "<=" | "<" | ">=" | "="}${" " | ""}${number | ""}`;
export type numberOrEmpty = string; //`${`,${number}` | ""}`;

export type numberOrEmptyX5 = string; //`${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}`;

export type Contains = string; // `in [${number}${numberOrEmptyX5}${numberOrEmptyX5}]`;

//export type Between = `between ${number},${number}`;

export type PluralOption = [
    SimpleCompare | Contains,
    string,
    ((val: number) => boolean)?
];
export type PluralOptions = PluralOption[];
export type Plurals = { [key: string]: PluralOptions };
export type SimpleDictionary = { [key: string]: string };
export type SimpleDictionaries = { [lang: string]: SimpleDictionary };

export type MiddlewareCreator<T = {}, TParams = {}, DT = any> = (
    data: DT
) => MiddlewareFunc<T, TParams>;

export type MiddlewareFunc<T = {}, TProps = {}> = (
    context: Context<T, TProps>,
    next: () => void
) => void;

export type SimpleTranslateFunc = (
    key: string,
    dynamicProps?: TranslateDynamicProps,
    fallback?: string,
    lang?: string
) => string;

export interface Middleware<T = {}, TProps = any> {
    exec(context: Context<T, TProps>, next: () => void): void;
}

export type Middlewares = Array<
    MiddlewareFunc<any, any> | Middleware<any, any>
>;

export interface Pipeline {
    run(params: ContextParams, settings: TranslateInternalSettings): string;
}
