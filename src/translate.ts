import { compileFunction } from "./compileFunction";
import { getTranslationValue } from "./getTranslationValue";
import { Dictionary, Translations } from "./Translations";

const regexProps = /(\$T)?{([\w|\d]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;

export function translate(
  dictionary: Dictionary | undefined,
  key: string,
  dynamicProps?: { [key: string]: string | number },
  fallback?: string,
  dynamicCache?: { [key: string]: string },
  storeAbsent?: (key: string, fallback?: string) => void
): string {
  if (key == null || key == "") {
    return "";
  }
  if (typeof key === "number") {
    key = "" + key;
  }

  if (typeof key !== "string") {
    throw new Error('"key" parameter is required');
  }

  let result = getTranslationValue(dictionary, key);

  let fallingBack = false;
  if (!result) {
    if (storeAbsent) {
      storeAbsent(key, fallback || "");
    }
    fallingBack = true;
    result = fallback || key;
  }

  if (!dynamicProps) {
    if (typeof result === "string") return result;
    return result?.value || "";
  } else {
    const val = typeof result === "string" ? result : result?.value;
    let dynamicKey: string = "";
    if (dynamicCache && !fallingBack) {
      dynamicKey = `${key}::${JSON.stringify(dynamicProps)}`;
      if (Object.prototype.hasOwnProperty.call(dynamicCache, dynamicKey)) {
        return dynamicCache[dynamicKey];
      }
    }
    const res = val.replace(
      regexProps,
      (
        all: string,
        leadingT: string | undefined,
        prop: string,
        propAll: string,
        propFallback: string,
        ind: number
      ): string => {
        var res: string | number | undefined;
        if (Object.prototype.hasOwnProperty.call(dynamicProps, prop)) {
          res = dynamicProps[prop];
        }
        if (res === undefined) {
          res = propFallback || prop;
        }

        if (
          typeof result !== "string" &&
          result?.plural &&
          !isNaN(res as number)
        ) {
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
          res = ret.replace(/(\$T)?\{\$\}/g, (all: string, subT: string) =>
            subT && res ? translate(dictionary, res as string) : (res as string)
          );
          return res;
        }

        if (!leadingT) {
          return res as string;
        } else {
          return translate(dictionary, res as string, undefined, undefined);
        }
      }
    );
    if (dynamicCache && !fallingBack) {
      dynamicCache[`${dynamicKey}`] = res;
    }
    return res;
  }
}
