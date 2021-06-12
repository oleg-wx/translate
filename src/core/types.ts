export interface Dictionary {
    [key: string]: string | DictionaryEntry | Dictionary;
    // | { [key: string]: any };
}

export interface DictionaryEntry {
    value: string;
    plural?: Plurals;
    description?: string;
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
