import { translate } from "./translate";

export type SimpleCompare =
  | "_"
  | `${">" | "<=" | "<" | ">=" | "="}${" " | ""}${number | ""}`;
export type numberOrEmpty = `${`,${number}` | ""}`;
export type numberOrEmptyX5 = `${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}`;
export type Contains = `in [${number}${numberOrEmptyX5}${numberOrEmptyX5}]`;
//export type Between = `between ${number},${number}`;
export type PluralOptions = [
  SimpleCompare | Contains,
  string,
  ((val: string | number) => boolean)?
];

export interface Dictionary {
  [key: string]: string | DictionaryEntry;
}
export interface DictionaryEntry {
  value: string;
  plural?: { [key: string]: PluralOptions[] };
  description?: string;
}

export class Translations {
  static regexProps = /(\$T)?{([\w|\d]+)\}/g;

  readonly dynamicCache: { [key: string]: string } = {};
  readonly absent: { [key: string]: string } = {};

  storeAbsent: boolean;
  cacheDynamic: boolean;

  constructor(
    private dictionaries?: { [lang: string]: Dictionary },
    options?: { cacheDynamic?: boolean; storeAbsent?: boolean }
  ) {
    this.cacheDynamic = !!options?.cacheDynamic;
    this.storeAbsent = !!options?.storeAbsent;
    // var a: DictionaryEntry = {
    //   value: "",
    //   plural: [">2", "string"],
    // };
  }

  translate(
    lang: string,
    key: string,
    stringParams?: { [key: string]: string | number },
    fallback?: string
  ): string {
    if (key == null || key == "") {
      return "";
    }
    if (typeof key !== "string") {
      throw new Error('"key" parameter is required');
    }

    let result = translate(
      this.dictionaries ? this.dictionaries[lang] : undefined,
      key,
      stringParams,
      fallback,
      this.cacheDynamic ? this.dynamicCache : undefined,
      this.storeAbsent ? this._storeAbsent : undefined
    );

    return result;
  }

  appendDictionary(lang: string, dictionary: Dictionary) {
    this.dictionaries = this.dictionaries || {};
    let existingDictionary = this.dictionaries[lang];

    if (existingDictionary) {
      for (let n in dictionary) {
        existingDictionary[n] = dictionary[n];
      }
    } else {
      this.dictionaries[lang] = dictionary;
    }
  }

  use(dictionary: Dictionary, dynamicCache?: { [key: string]: string }) {
    return (
      key: string,
      stringParams?: { [key: string]: string | number },
      fallback?: string
    ) => translate(dictionary, key, stringParams, fallback, dynamicCache);
  }

  private _storeAbsent(key: string, fallback?: string) {
    this.absent[key] = fallback || "";
  }
}


