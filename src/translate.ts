import { compileFunction } from "./compileFunction";
import { getTranslationValue } from "./getTranslationValue";
import { Dictionary, DictionaryEntry, Translations } from "./Translations";

const regexProps =
  /\$(\$)?{([\$\#\w|\d\-\:]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;
const regex$lessProps =
  /(\$\$)?{([\w|\d]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;

const numProps = "$#";
const regexNumProps = /\$\#/g;

type translateDynamicProps = { [key: string]: string | number };
type translateOptions = {
  fallbackDictionary?: Dictionary;
  fallback?: string | undefined;
  fallbackCache?: { [key: string]: string } | undefined;
  dynamicCache?: { [key: string]: string } | undefined;
  storeAbsent?: ((key: string, fallback?: string) => void) | undefined;
  $less?: boolean;
};

export function translate(
  dictionary: Dictionary | undefined,
  key: string | string[],
  dynamicProps?: translateDynamicProps,
  options?: translateOptions
): string {
  if (key == null || key == "") {
    return "";
  }
  if (typeof key === "number") {
    key = "" + key;
  }

  if (typeof key !== "string" && !Array.isArray(key)) {
    throw new Error('"key" parameter is required');
  }

  const _regexp = !!options?.$less ? regex$lessProps : regexProps;

  let result = getTranslationValue(dictionary, key);

  let fallingBack = false;
  if (!result) {
    if (options?.storeAbsent) {
      options?.storeAbsent(key.toString(), options?.fallback || "");
    }
    if (
      options?.fallbackDictionary &&
      options.fallbackDictionary !== dictionary &&
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
    if (ret.indexOf("{") < 0) return ret;
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
    _regexp,
    replace(_regexp, dictionary, result, dynamicProps, options)
  );
  if (options?.dynamicCache && !fallingBack && dynamicKey) {
    options.dynamicCache[`${dynamicKey}`] = res;
  }
  return res;
}

function replace(
  _regexp: RegExp,
  dictionary: Dictionary | undefined,
  result: string | DictionaryEntry | undefined,
  dynamicProps: translateDynamicProps | undefined,
  options: translateOptions | undefined
) {
  return (
    all: string,
    leadingT: string | undefined,
    prop: string,
    propAll: string,
    propFallback: string,
    ind: number,
    text: string
  ): string => {
    var res: string | number | undefined;
    if (Object.prototype.hasOwnProperty.call(dynamicProps || {}, prop)) {
      res = dynamicProps![prop];
    }
    if (res === undefined) {
      res = propFallback || prop;
    }

    if (typeof result !== "string" && result?.plural && !isNaN(res as number)) {
      var tr_values = result.plural[prop];
      var ret = numProps;
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
      regexNumProps;
      var replaced = ret.replace(
        regexNumProps,
        (pattern: string, val: string, text: string) =>
          // res
          //   ? translate(
          //       dictionary,
          //       val.replace(/\$\#/g, res as string),
          //       undefined,
          //       {
          //         $less: options?.$less,
          //       }
          //     )
          //   :
          res as string
      );
      _regexp.lastIndex = 0;
      if (_regexp.test(replaced)) {
        replaced = replaced.replace(
          _regexp,
          (
            all: string,
            leadingT: string | undefined,
            prop: string,
            propAll: string,
            propFallback: string,
            ind: number,
            text: string
          ) =>
            translate(dictionary, prop, dynamicProps, {
              $less: options?.$less,
            })
        );
      }
      return replaced;
    }

    if (!leadingT) {
      return res as string;
    } else {
      return translate(dictionary, res as string, undefined, {
        $less: options?.$less,
      });
    }
  };
}
