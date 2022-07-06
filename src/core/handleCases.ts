import { getOperatorFn } from './operators/get-operator';
import { endsWithOperator, startsWithOperator } from './operators/operators';
import { truthyFalsyOperator, compareOperator } from './operators/simple-operators';
import { CaseOptions, Operator } from './types';

const valProps = '$#';
const regexValProps = /\$\#/g;

const operators: Operator[] = [truthyFalsyOperator, compareOperator, startsWithOperator, endsWithOperator];

export function handleCases(value: any, options: CaseOptions) {
    let _values = options;
    let _value = valProps;
    if (_values) {
        for (let i = 0; i < _values.length; i++) {
            let _value_tmp_ = _values[i];
            let key_ = _value_tmp_[0];
            if (key_ === '_') {
                _value = _value_tmp_[1];
            } else {
                let operatorFunction_ = _value_tmp_[2];
                if (!operatorFunction_) {
                    operatorFunction_ = getOperatorFn(
                        key_,
                        operators,
                        (key) => new Error(`case operator "${key}" not supported`)
                    ).exec(key_);
                    _value_tmp_[2] = operatorFunction_;
                }
                if (operatorFunction_(value)) {
                    _value = _value_tmp_[1];
                    break;
                }
            }
        }
    }
    regexValProps.lastIndex = 0;
    var replacedValue = _value.replace(regexValProps, (pattern: string, val: string, text: string) => value as string);
    return replacedValue;
}
