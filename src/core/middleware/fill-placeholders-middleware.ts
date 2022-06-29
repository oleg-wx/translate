import { pluralize } from '../pluralize';
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
    const _plurals = result.plural;

    const replaced: string = replacePlaceholders(
        regexp,
        value,
        _plurals,
        dynamicProps,
        !!context.translate
            ? (
                  key: string,
                  dynamicProps?: TranslateDynamicProps,
                  fallback?: string
              ) => context.translate!(key, dynamicProps, fallback)
            : undefined,
        pluralize,
        {
            shouldReplaceDynamic: result._shouldReplace,
            shouldTranslate: result._shouldTranslate,
        }
    );

    result.value = replaced;
};
