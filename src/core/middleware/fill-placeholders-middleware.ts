import { pluralize } from '../pluralize';
import { handleCases } from '../handleCases';
import { replacePlaceholders } from '../_replace-placeholders';
import { MiddlewareFunc, RegExpResult } from '../types';
import { TranslateDynamicProps } from '../types';

export const FillPlaceholdersMiddleware: MiddlewareFunc<RegExpResult, {}> = (
    context,
) => {
    const { params, result } = context;
    const value = result.value;
    const dynamicProps = params.dynamicProps;

    if (!value || !result._testPlaceholder || !result._replacePlaceholders) {
        return;
    }

    const hasPlaceholder = result._testPlaceholder(value);

    if (!hasPlaceholder) {
        return;
    }

    var regexp = result._replacePlaceholders;
    const _plurals = result.plurals;
    const _cases = result.cases;

    const replaced: string = replacePlaceholders(
        regexp,
        value,
        _plurals,
        _cases,
        dynamicProps,
        !!context.translate
            ? (
                  key: string,
                  dynamicProps?: TranslateDynamicProps,
                  fallback?: string
              ) => context.translate!(key, dynamicProps, fallback)
            : undefined,
        pluralize,
        handleCases,
        {
            shouldReplaceDynamic: result._shouldReplace,
            shouldTranslate: result._shouldTranslate,
            shouldUseCases: result._shouldUseCases,
        }
    );

    result.value = replaced;
};
