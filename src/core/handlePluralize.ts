import { getOperatorFn } from './operators/get-operator';
import {
    betweenOperator,
    endsWithOperator,
    inOperator,
    remainderOperator,
    startsWithOperator,
} from './operators/operators';
import { compareOperator, truthyFalsyOperator} from './operators/simple-operators';
import { Operator, PluralOptions } from './types';

const operators: Operator[] = [
    truthyFalsyOperator,
    compareOperator,
    inOperator,
    betweenOperator,
    remainderOperator,
    endsWithOperator,
    startsWithOperator,
];

const numProps = '$#';
const regexNumProps = /\$\#/g;

export function handlePluralize(value: string | number | boolean, pluralOptions: PluralOptions) {
    var pluralValues = pluralOptions;
    var pluralValue = numProps;
    if (pluralValues) {
        let num = +value;
        for (let i = 0; i < pluralValues.length; i++) {
            let pluralValue_tmp_ = pluralValues[i];
            let key_ = pluralValue_tmp_[0];
            if (key_ === '_') {
                pluralValue = pluralValue_tmp_[1];
            } else {
                let operatorFn_ = pluralValue_tmp_[2];
                if (!operatorFn_) {
                    operatorFn_ = getOperatorFn(key_, operators).exec(key_);
                    pluralValue_tmp_[2] = operatorFn_;
                }
                if (operatorFn_(num)) {
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
