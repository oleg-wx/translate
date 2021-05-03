import { translate } from "./translate";

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
  readonly dynamicCache: { [lang: string]: { [key: string]: string } } = {};
  readonly absent: { [key: string]: string } = {};
  $less = false;
  dictionaries?: { [lang: string]: Dictionary }
  storeAbsent: boolean;
  cacheDynamic: boolean;

  constructor(
    dictionaries?: { [lang: string]: Dictionary },
    options?: { cacheDynamic?: boolean; storeAbsent?: boolean }
  ) {
    this.dictionaries = dictionaries || {};
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
    dynamicProps?: { [key: string]: string | number },
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
      dynamicProps,
      fallback,
      this.cacheDynamic
        ? (this.dynamicCache[lang] = this.dynamicCache[lang] || {})
        : undefined,
      this.storeAbsent ? this._storeAbsent : undefined,
      this.$less
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

  use(dictionary: Dictionary, dynamicCache?: { [key: string]: string }) {
    return (
      key: string,
      stringParams?: { [key: string]: string | number },
      fallback?: string
    ) => translate(dictionary, key, stringParams, fallback, dynamicCache, undefined, this.$less);
  }

  private _storeAbsent(key: string, fallback?: string) {
    this.absent[key] = fallback || "";
  }
}
