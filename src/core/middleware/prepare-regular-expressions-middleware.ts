import { pluralize } from '../pluralize';
import { replacePlaceholders } from '../_replace-placeholders';
import { MiddlewareFunc, PlaceholderParams, RegExpResult } from '../types';
import { TranslateDynamicProps } from '../types';

const replacePlaceholdersRx = new RegExp(
    '(\\$?[\\&\\!]?){([\\w\\d\\.\\-]+)(\\?([\\d\\w\\s,.+-=_?!@#$%^&*()]+))?\\}',
    'g'
);

const replacePlaceholdersRx_single = new RegExp(
    '([\\&\\!]?){([\\w\\d\\.\\-]+)(\\?([\\d\\w\\s,.+-=_?!@#$%^&*()]+))?\\}',
    'g'
);

const replacePlaceholdersRx_double = new RegExp(
    '([\\&\\!]?){{([\\w\\d\\.\\-]+)(\\?([\\d\\w\\s,.+-=_?!@#$%^&*()]+))?\\}}',
    'g'
);

const testPlaceholderRx = /[\$\&\!]\{/;
const testPlaceholderRx_single = /[\&\!]?\{/;
const testPlaceholderRx_double = /[\&\!]?\{\{/;

const shouldReplace = (prefix: string, placeholder: string) =>
    prefix?.includes('$');

const shouldReplace_single_double = (prefix: string, placeholder: string) =>
    true;

const shouldTranslate = (prefix: string, placeholder: string) =>
    prefix.includes('&');

const shouldUseCases = (prefix: string, placeholder: string) =>
    prefix.includes('!');

const testPlaceholder = (value: string) => {
    testPlaceholderRx.lastIndex = 0;
    return testPlaceholderRx.test(value);
};

const testPlaceholder_single = (value: string) => {
    testPlaceholderRx_single.lastIndex = 0;
    return testPlaceholderRx_single.test(value);
};

const testPlaceholder_double = (value: string) => {
    testPlaceholderRx_single.lastIndex = 0;
    return testPlaceholderRx_double.test(value);
};

export const PrepareRegularExpressionsMiddleware: MiddlewareFunc<
    RegExpResult,
    PlaceholderParams
> = (context) => {
    const { params, result } = context;
    if (!params.data?.placeholder || params.data?.placeholder === 'default') {
        result._testPlaceholder = testPlaceholder;
        result._replacePlaceholders = replacePlaceholdersRx;
        result._shouldReplace = shouldReplace;
    } else if (params.data?.placeholder === 'single') {
        result._testPlaceholder = testPlaceholder_single;
        result._replacePlaceholders = replacePlaceholdersRx_single;
        result._shouldReplace = shouldReplace_single_double;
    } else if (params.data?.placeholder === 'double') {
        result._testPlaceholder = testPlaceholder_single;
        result._replacePlaceholders = replacePlaceholdersRx_double;
        result._shouldReplace = shouldReplace_single_double;
    }
    result._shouldTranslate = shouldTranslate;
    result._shouldUseCases = shouldUseCases;

    result._replacePlaceholders.lastIndex = 0;
};

function escapeRegExp(val: string): string {
    return val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
