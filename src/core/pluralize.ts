import { compileFunction } from "../compileFunction";
import { numProps, regexNumProps } from "./global";
import { Plurals } from "./types";

export function pluralize(
    value: string | number,
    prop: string,
    pluralOptions: Plurals,
) {
    var pluralValues = pluralOptions[prop];
    var pluralValue = numProps;
    if (pluralValues) {
        let num = +value as number;
        for (let i = 0; i < pluralValues.length; i++) {
            let pluralValue_tmp_ = pluralValues[i];
            let key_ = pluralValue_tmp_[0];
            if (key_ === '_') {
                pluralValue = pluralValue_tmp_[1];
            } else {
                let operatorFunction_ = pluralValue_tmp_[2];
                if (!operatorFunction_) {
                    operatorFunction_ = compileFunction(key_);
                    pluralValue_tmp_[2] = operatorFunction_;
                }
                if (operatorFunction_(num)) {
                    pluralValue = pluralValue_tmp_[1];
                    break;
                }
            }
        }
    }
    regexNumProps.lastIndex = 0;
    var replacedValue = pluralValue.replace(
        regexNumProps,
        (pattern: string, val: string, text: string) => value as string
    );
    return replacedValue;
}