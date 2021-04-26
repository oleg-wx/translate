import { compileFunction } from "./compileFunction";
import { getTranslationValue } from "./getTranslationValue";
import { Dictionary, Translations } from "./Translations";


export function translate(
  dictionary: Dictionary | undefined,
  key: string,
  stringParams?: { [key: string]: string | number; },
  fallback?: string,
  dynamicCache?: { [key: string]: string; },
  storeAbsent?: (key: string, fallback?: string) => void
): string {
  if (key == null || key == "") {
    return "";
  }
  if (typeof key !== "string") {
    throw new Error('"key" parameter is required');
  }

  var result = dictionary ? getTranslationValue(dictionary, key) : key;

  if (!result) {
    if (storeAbsent) {
      storeAbsent(key, fallback);
    }
    result = key;
  }

  if (!stringParams) {
    if (typeof result === "string")
      return result;
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
          if (tr_values) {
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
                if (fn(res)) {
                  ret = tr_value[1];
                  break;
                }
              }
            }
          }
          res = ret.replace(/\{\$\}/g, res as string);
          return res;
        }

        if (!leadingT) {
          return res as string;
        } else {
          return translate(
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
