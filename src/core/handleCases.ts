import { CaseOption, CaseOptions } from './types';

const valProps = '$#';
const regexValProps = /\$\#/g;

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
                    operatorFunction_ = compileCasesFunction(key_);
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
    var replacedValue = _value.replace(
        regexValProps,
        (pattern: string, val: string, text: string) => value as string
    );
    return replacedValue;
}

export function compileCasesFunction(caseKey: CaseOption[0]) {
    if (caseKey === '!') {
        return (val: any) => !val;
    }
    else{
        return (val: any) => !!val;
    }
}
