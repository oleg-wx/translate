import { compileFunction } from "./compileFunction";
import { getTranslationValue } from "./getTranslationValue";
import { Dictionary, Translations } from "./Translations";

const regexProps = /\$(T)?{([\w|\d]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;
const regex$lessProps = /(\$T)?{([\w|\d]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;

const regexSubProps = /(\$T)?\{([\d\w\-_]*\$[\d\w\-_]*)\}/g;

export function translate(
  dictionary: Dictionary | undefined,
  key: string,
  dynamicProps: { [key: string]: string | number } | undefined,
  options?: {
    fallbackDictionary?: Dictionary;
    fallback?: string | undefined;
    fallbackCache?: { [key: string]: string } | undefined;
    dynamicCache?: { [key: string]: string } | undefined;
    storeAbsent?: ((key: string, fallback?: string) => void) | undefined;
    $less?: boolean;
  }
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
    if (options?.storeAbsent) {
      options?.storeAbsent(key, options?.fallback || "");
    }
    if (
      options?.fallbackDictionary &&
      getTranslationValue(options.fallbackDictionary, key)
    ) {
      return translate(options.fallbackDictionary, key, dynamicProps, {
        $less: options.$less,
        dynamicCache: options.fallbackCache,
      });
    }
    fallingBack = true;
    result = options?.fallback || key;
  }

  if (!dynamicProps) {
    let ret = typeof result === "string" ? result : result.value;
    if (ret.indexOf("{")<0) return ret;
  }
  const val = typeof result === "string" ? result : result?.value;
  let dynamicKey: string = "";
  if (options?.dynamicCache && dynamicProps && !fallingBack) {
    dynamicKey = `${key}::${JSON.stringify(dynamicProps).replace(
      /[\"\{\}]/g,
      ""
    )}`;
    if (
      Object.prototype.hasOwnProperty.call(options?.dynamicCache, dynamicKey)
    ) {
      return options?.dynamicCache[dynamicKey];
    }
  }
  const res = val.replace(
    !!options?.$less ? regex$lessProps : regexProps,
    (
      all: string,
      leadingT: string | undefined,
      prop: string,
      propAll: string,
      propFallback: string,
      ind: number
    ): string => {
      var res: string | number | undefined;
      if (Object.prototype.hasOwnProperty.call(dynamicProps || {}, prop)) {
        res = dynamicProps![prop];
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
        let num = +res as number;
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
              if (fn(num)) {
                ret = tr_value[1];
                break;
              }
            }
          }
        }
        res = ret.replace(
          regexSubProps,
          (all: string, subT: string, val: string) =>
            subT && res
              ? translate(
                  dictionary,
                  val.replace(/\$/, res as string),
                  undefined,
                  {
                    $less: options?.$less,
                  }
                )
              : (res as string)
        );
        return res;
      }

      if (!leadingT) {
        return res as string;
      } else {
        return translate(dictionary, res as string, undefined, {
          $less: options?.$less,
        });
      }
    }
  );
  if (options?.dynamicCache && !fallingBack && dynamicKey) {
    options.dynamicCache[`${dynamicKey}`] = res;
  }
  return res;
}
