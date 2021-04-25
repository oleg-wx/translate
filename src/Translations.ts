export type SimpleCompare = "_" | `${">" | "<" | "="}${" " | ""}${number | ""}`;
export type numberOrEmpty = `${`,${number}` | ""}`;
export type numberOrEmptyX5 = `${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}${numberOrEmpty}`;
export type Contains = `in [${number}${numberOrEmptyX5}${numberOrEmptyX5}]`;
//export type Between = `between ${number},${number}`;
export type PluralOptions = [
  SimpleCompare | Contains,
  string,
  (() => boolean)?
];

export interface Dictionary {
  [key: string]: string | DictionaryEntry;
}
export interface DictionaryEntry {
  value: string;
  plural?: { [key: string]: PluralOptions[] };
  description?: string;
}
export interface PluralEntry {}

export class Translations {
  static regexProps = /(\$T)?{([\w|\d]+)\}/g;

  readonly dynamicCache: { [key: string]: string } = {};
  readonly absent: { [key: string]: string } = {};

  constructor(
    private dictionaries?: { [lang: string]: Dictionary },
    private storeAbsent: boolean = false,
    private cacheDynamic: boolean = false
  ) {
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

    let result = this._translate(
      this.dictionaries ? this.dictionaries[lang] : undefined,
      key,
      stringParams,
      fallback,
      this.storeAbsent ? this._storeAbsent : undefined,
      this.cacheDynamic ? this.dynamicCache : undefined
    );

    return result;
  }

  appendDictionary(lang: string, dictionary: Dictionary) {
    this.dictionaries = this.dictionaries || {};
    let existingDictionary = (this.dictionaries[lang] =
      this.dictionaries[lang] || {});

    for (let n in dictionary) {
      existingDictionary[n] = dictionary[n];
    }
  }

  use(dictionary: Dictionary) {
    return (
      key: string,
      stringParams?: { [key: string]: string },
      fallback?: string
    ) => this._translate(dictionary, key, stringParams, fallback);
  }

  private _translate(
    dictionary: Dictionary | undefined,
    key: string,
    stringParams?: { [key: string]: string | number },
    fallback?: string,
    storeAbsent?: (key: string, fallback?: string) => void,
    dynamicCache?: { [key: string]: string }
  ): string {
    if (key == null || key == "") {
      return "";
    }
    if (typeof key !== "string") {
      throw new Error('"key" parameter is required');
    }

    var result = dictionary ? this._getTerm(dictionary, key) : key;

    if (!result) {
      if (storeAbsent) {
        storeAbsent(key, fallback);
      }
      result = key;
    }

    if (!stringParams) {
      if (typeof result === "string") return result;
      return result?.value || "";
    } else {
      const val = typeof result === "string" ? result : result?.value;
      let dynamicKey: string = "";
      if (dynamicCache) {
        dynamicKey = `${key}::${JSON.stringify(stringParams)}`;
        if (Object.prototype.hasOwnProperty.call(dynamicCache, dynamicKey)) {
          return dynamicCache[dynamicKey];
        }
      }
      var res = val.replace(
        Translations.regexProps,
        (
          all: string,
          leadingT: string | undefined,
          prop: string,
          ind: number
        ): string => {
          var res;
          if (Object.prototype.hasOwnProperty.call(stringParams, prop)) {
            res = stringParams[prop];
          } else {
            res = prop;
          }

          if (typeof result !== "string" && result?.plural) {
            var tr_values = result.plural[prop];
            var ret = "{$}";
            for (let i = 0; i < tr_values.length; i++) {
              let tr_value = tr_values[i];
              let key = tr_value[0];
              if (key === "_") {
                ret = tr_value[1];
              } else {
                let fn = tr_value[2];
                if (!fn) {
                  fn = compileFunction(key);
                  tr_value[2] = fn;
                }
                if (fn.call(res)) {
                  ret = tr_value[1];
                  break;
                }
              }
            }
            res = ret.replace(/\{\$\}/g, res as string);
            return res;
          }

          if (!leadingT) {
            return res as string;
          } else {
            return this._translate(
              dictionary,
              res as string,
              undefined,
              fallback
            );
          }
        }
      );
      if (dynamicCache) {
        dynamicCache[`${dynamicKey}`] = res;
      }
      return res;
    }
  }

  private _getTerm(
    dictionary: Dictionary | undefined,
    key: string
  ): string | DictionaryEntry | undefined {
    if (!key) {
      return undefined!;
    }
    if (!dictionary) {
      return undefined!;
    }
    var term = dictionary[key];
    if (typeof term === "string") {
      return term;
    }
    return term;
  }

  private _storeAbsent(key: string, fallback?: string) {
    this.absent[key] = fallback || "";
  }
}

function compileFunction(operator: SimpleCompare | Contains): () => boolean {
  let _operator = operator.replace(/\{\$\}/g, "this").replace(/=/g, "==");
  if (/[>=<]/.exec(_operator)?.index === 0) {
    _operator = `this ${_operator}`;
  } else if (operator.indexOf("in [") == 0) {
    _operator = operator.replace(
      /in (\[[\d\s,]+\])/g,
      (all: string, arr: string) => `${arr} + ".includes(this)`
    );
  }
  return Function(`"use strict"; return ${_operator}`) as any;
}
