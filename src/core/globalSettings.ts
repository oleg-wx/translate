import { TranslateInternalSettings } from './types';

var replacePlaceholdersRegexStr =
    '([\\$\\&]{1,2}){([\\w|\\d\\-{{ns}}]+)(\\?([\\d\\w\\s,.+-=_?!@#$%^&*()]+))?\\}';
var replacePlaceholdersRegex_$lessStr =
    '(\\&{0,1}){([\\w|\\d\\-{{ns}}]+)(\\?([\\d\\w\\s,.+-=_?!@#$%^&*()]+))?\\}';

var replacePlaceholdersRegex: RegExp;
///(\$)?(\&)?{([\$\#\w|\d\-\.]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;
var replacePlaceholdersRegex_$less: RegExp;
///()(\&)?{([\w|\d]+)(\?([\d\w\s,.+\-=_?!@#$%^&*()]+))?\}/g;
var namespaceSeparator = '.';

interface gs extends TranslateInternalSettings {
    replacePlaceholdersRx: RegExp;
    replacePlaceholdersRx_$less: RegExp;
    namespaceSeparator: string;
}
var globalSettings: gs = {
    get namespaceSeparator(): string {
        return namespaceSeparator;
    },
    set namespaceSeparator(value: string) {
        namespaceSeparator = value;
        replacePlaceholdersRegex = new RegExp(
            replacePlaceholdersRegexStr.replace('{{ns}}', escapeRegExp(value)),
            'g'
        );
        replacePlaceholdersRegex_$less = new RegExp(
            replacePlaceholdersRegex_$lessStr.replace(
                '{{ns}}',
                escapeRegExp(value)
            ),
            'g'
        );
    },
    $less: false,
    get replacePlaceholdersRx(): RegExp {
        return replacePlaceholdersRegex;
    },
    get replacePlaceholdersRx_$less(): RegExp {
        return replacePlaceholdersRegex_$less;
    },
};
globalSettings.namespaceSeparator = '.';
export default globalSettings;

function escapeRegExp(val: string): string {
    return val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
