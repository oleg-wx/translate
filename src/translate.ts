import { compileFunction } from './compileFunction'
import { getTranslationValue } from './getTranslationValue'
import {
    Dictionary,
    DictionaryEntry,
    Plurals,
    Translations,
} from './Translations'

const regexProps =
    /(\$)?(\&)?{([\$\#\w|\d\-\:]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g
const regex$lessProps =
    /()(\&)?{([\w|\d]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g

const numProps = '$#'
const regexNumProps = /\$\#/g

export type translateDynamicProps = {
    [key: string]: string | number | undefined
}
type translateOptions = {
    fallbackDictionary?: Dictionary
    fallback?: string | undefined
    fallbackCache?: { [key: string]: string } | undefined
    dynamicCache?: { [key: string]: string } | undefined
    storeAbsent?: ((key: string, fallback?: string) => void) | undefined
    $less?: boolean
}

/**
 *
 * @param dictionary - Dictionary to use to translate
 * @param key - translation key
 * @param dynamicProps - object to use for placeholders
 * @param options - options
 * @returns
 */
export function translate(
    dictionary: Dictionary | undefined,
    key: string | string[],
    dynamicProps?: translateDynamicProps,
    options?: translateOptions
): string {
    if (key == null || key == '') {
        return ''
    }
    // to satisfy type check and 0 value
    if (typeof key === 'number') {
        key = '' + key
    }

    // guard from wrong key
    if (typeof key !== 'string' && !Array.isArray(key)) {
        throw new Error('"key" parameter is required')
    }

    // select RegExp to use for using $less
    const _regexp = !!options?.$less ? regex$lessProps : regexProps
    // as global used setting search index
    _regexp.lastIndex = 0

    // separate key for using namespace
    if (typeof key === 'string' && key.indexOf(':') >= 0) {
        key = key.split(':').filter((o) => o)
    }
    let result = getTranslationValue(dictionary, key)

    let fallingBackToValue = false
    if (!result) {
        // storing absent translations for future monitoring
        if (options?.storeAbsent) {
            options?.storeAbsent(key.toString(), options?.fallback || '')
        }

        //trying to fallback translation from fallback dictionary
        if (
            options?.fallbackDictionary &&
            options.fallbackDictionary !== dictionary &&
            getTranslationValue(options.fallbackDictionary, key)
        ) {
            return translate(options.fallbackDictionary, key, dynamicProps, {
                $less: options.$less,
                dynamicCache: options.fallbackCache,
            })
        }
        fallingBackToValue = true
        result =
            options?.fallback ||
            (typeof key === 'string' ? (key as string) : key.join(':'))
    }

    // trying to speed up when no dynamic values present
    // and probably(!) no placeholders
    if (!dynamicProps) {
        let ret = typeof result === 'string' ? result : result.value
        if (ret.indexOf('{') < 0) return ret
    }

    const val = typeof result === 'string' ? result : result?.value

    // trying to get dynamic cache
    let dynamicKey: string = ''
    if (options?.dynamicCache && dynamicProps && !fallingBackToValue) {
        dynamicKey = `${key}::${JSON.stringify(dynamicProps).replace(
            /[\"\{\}]/g,
            ''
        )}`
        if (
            Object.prototype.hasOwnProperty.call(
                options?.dynamicCache,
                dynamicKey
            )
        ) {
            return options?.dynamicCache[dynamicKey]
        }
    }

    // as we use global instance :)
    _regexp.lastIndex = 0

    // here we go ->
    const res = val.replace(
        _regexp,
        replace(_regexp, dictionary, result, dynamicProps, options)
    )

    // cache translation
    if (options?.dynamicCache && !fallingBackToValue && dynamicKey) {
        options.dynamicCache[`${dynamicKey}`] = res
    }
    return res
}

function replace(
    _regexp: RegExp,
    dictionary: Dictionary | undefined,
    dictionaryValue: string | DictionaryEntry | undefined,
    dynamicProps: translateDynamicProps | undefined,
    options: translateOptions | undefined
) {
    return (
        all: string,
        replaceDynamic: string | undefined,
        leadingT: string | undefined,
        prop: string,
        propAll: string,
        propFallback: string,
        ind: number,
        text: string
    ): string => {
        var replaceValue: string | number | undefined
        if (replaceDynamic || options?.$less) {
            if (
                Object.prototype.hasOwnProperty.call(dynamicProps || {}, prop)
            ) {
                replaceValue = dynamicProps![prop]
            }
            if (replaceValue === undefined) {
                replaceValue = propFallback || prop
            }
        } else {
            replaceValue = prop
        }

        if (
            typeof dictionaryValue !== 'string' &&
            dictionaryValue?.plural &&
            !isNaN(replaceValue as number)
        ) {
            replaceValue = tryToPluralize(
                _regexp,
                dictionary,
                dictionaryValue.plural,
                prop,
                dynamicProps,
                options,
                replaceValue
            )
        }

        if (!leadingT) {
            return replaceValue as string
        } else {
            return translate(dictionary, replaceValue as string, dynamicProps, {
                $less: options?.$less,
            })
        }
    }
}

function tryToPluralize(
    _regexp: RegExp,
    dictionary: Dictionary | undefined,
    plurals: Plurals,
    prop: string,
    dynamicProps: translateDynamicProps | undefined,
    options: translateOptions | undefined,
    replaceValue: string | number
) {
    var tr_values = plurals[prop]
    var ret = numProps
    let num = +replaceValue as number
    if (tr_values) {
        for (let i = 0; i < tr_values.length; i++) {
            let tr_value = tr_values[i]
            let key = tr_value[0]
            if (key === '_') {
                ret = tr_value[1]
            } else {
                let fn = tr_value[2]
                if (!fn) {
                    fn = compileFunction(key)
                    tr_value[2] = fn
                }
                if (fn(num)) {
                    ret = tr_value[1]
                    break
                }
            }
        }
    }
    regexNumProps.lastIndex = 0
    var replaced = ret.replace(
        regexNumProps,
        (pattern: string, val: string, text: string) => replaceValue as string
    )
    _regexp.lastIndex = 0
    if (_regexp.test(replaced)) {
        replaced = replaced.replace(
            _regexp,
            (
                all: string,
                replaceDynamic: string | undefined,
                leadingT: string | undefined,
                prop: string,
                propAll: string,
                propFallback: string,
                ind: number,
                text: string
            ) => {
                var ret = prop
                if (replaceDynamic) {
                    ret = replace(
                        _regexp,
                        dictionary,
                        prop,
                        dynamicProps,
                        options
                    )(
                        all,
                        replaceDynamic,
                        leadingT,
                        prop,
                        propAll,
                        propFallback,
                        ind,
                        text
                    )
                } else if (leadingT) {
                    ret = translate(dictionary, prop, dynamicProps, {
                        $less: options?.$less,
                    })
                }
                return ret
            }
        )
    }
    return replaced
}
