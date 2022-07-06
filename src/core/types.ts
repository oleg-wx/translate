import { TranslateKeyInstance } from './translation-key';

export interface ContextParams<TData = any> {
    dictionaries: Dictionaries;
    key: TranslateKeyInstance;
    lang: string;
    dynamicProps?: TranslateDynamicProps;
    fallback?: DictionaryEntry | string;
    data?: TData;
}

export interface ContextBaseResult {
    entry?: DictionaryValue;
    value?: string;
    plurals?: Plurals;
    cases?: Cases;
    fallingBack?: boolean;
    fallingBackToKey?: boolean;
}

export interface Context<T = {}, TParamsData = any> {
    params: ContextParams<TParamsData>;
    result: ContextBaseResult & T;
    translate?: SimpleTranslateFunc;
}

export interface RegExpResult {
    _replacePlaceholders: RegExp;
    _testPlaceholder: (val: string) => boolean;
    _shouldReplace: (prefix: string, placeholder: string) => boolean;
    _shouldTranslate: (prefix: string, placeholder: string) => boolean;
    _shouldUseCases: (prefix: string, placeholder: string) => boolean;
}

export interface FallbackLangParams {
    fallbackLang?: string;
}

export interface FallbackLangResult {
    fallingBackLang?: string;
}

export type PlaceholderType = 'default' | 'single' | 'double';

export interface PlaceholderParams {
    placeholder?: PlaceholderType;
}

export type TranslateKey = string | string[];

export interface DictionaryEntry {
    value: string;
    plural?: Plurals;
    cases?: Cases;
    description?: string;
}

export type DictionaryValue = string | DictionaryEntry | Dictionary;

export interface Dictionary {
    [key: string]: DictionaryValue;
}

export interface Dictionaries {
    [lang: string]: Dictionary;
}

export type TranslateDynamicProps = {
    [key: string]: string | number | boolean | undefined;
};

export interface Operator {
    test(value: string): boolean;
    exec(operation: string): (value: string | number | boolean | Date) => boolean;
}

export type SimpleCompare = string;
// | '_'
// | `${'>' | '<=' | '<' | '>=' | '='}${' ' | ''}${number | ''}`
// | `%${number | ''}${'=' | ''}${number}`;
export type numberOrEmpty = string; // `${`,${number}` | ''}`;

export type numberOrEmptyX5 = string;
// `${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}`;

export type Contains = string; //`in [${number}${numberOrEmptyX5}${numberOrEmptyX5}]`;

//export type Between = `between ${number},${number}`;

export type PluralOption = [SimpleCompare | Contains, string, ReturnType<Operator['exec']>?];
export type PluralOptions = PluralOption[];
export type Plurals = { [key: string]: PluralOptions };
export type SimpleDictionary = { [key: string]: string };
export type SimpleDictionaries = { [lang: string]: SimpleDictionary };

export type CaseOption = [string, string, ((val: string) => boolean)?];
export type CaseOptions = CaseOption[];
export type Cases = { [key: string]: CaseOptions };

export type SimpleTranslateFunc = (
    key: string,
    dynamicProps?: TranslateDynamicProps,
    fallback?: string,
    lang?: string
) => string;

export type MiddlewareFunc<T = {}, TProps = {}> = (context: Context<T, TProps>) => void;

export interface MiddlewareStatic<T = {}, TProps = any> {
    exec(context: Context<T, TProps>): void;
}

export abstract class MiddlewareCreator<T = {}, TProps = any> {
    abstract create(): Middleware<T, TProps>;
}

export type Middleware<T, TProps> = MiddlewareFunc<T, TProps> | MiddlewareStatic<T, TProps>;

export type Middlewares = Array<Middleware<any, any>>;

export interface Pipeline {
    run<T = {}>(params: ContextParams<T>): string;
}

export interface TranslateOptions extends PlaceholderParams, FallbackLangParams {}
