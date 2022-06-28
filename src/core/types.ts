import { TranslateKeyInstance } from './translation-key';

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
    translate?: SimpleTranslateFunc;
}

export interface CachedResult {
    dynamicKey: string;
    fromCache: boolean;
}

export interface RegExpResult {
    _replacePlaceholders: RegExp;
    _testPlaceholder: (val: string) => boolean;
    _shouldReplace: (prefix: string, placeholder: string) => boolean;
    _shouldTranslate: (prefix: string, placeholder: string) => boolean;
}

export interface FallbackLangParams {
    fallbackLang?: string;
}

export type PlaceholderType = 'default' | 'single' | 'double';

export interface PlaceholderParams {
    placeholder?: PlaceholderType;
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

export interface MiddlewareStatic<T = {}, TProps = any> {
    exec(context: Context<T, TProps>, next: () => void): void;
}

export type Middlewares = Array<
    MiddlewareFunc<any, any> | MiddlewareStatic<any, any>
>;

export interface Pipeline {
    run<T = {}>(params: ContextParams<T>): string;
}
