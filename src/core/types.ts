export interface Dictionary {
    [key: string]: string | DictionaryEntry | Dictionary;
}

export interface DictionaryEntry {
    value: string;
    plural?: Plurals;
    description?: string;
}

export type TranslateKey = string | string[];

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

export type PluralOptions = [
    SimpleCompare | Contains,
    string,
    ((val: number) => boolean)?
];
export type Plurals = { [key: string]: PluralOptions[] };

export type GetDictionaryEntry = (
    key: TranslateKey
) => DictionaryEntry | string | undefined;
