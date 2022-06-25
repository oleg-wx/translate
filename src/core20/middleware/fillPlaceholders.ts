import globalSettings, { testPlaceholder } from '../globalSettings';
import { pluralize } from '../pluralize';
import { replacePlaceholders } from '../_replacePlaceholders';
import { MiddlewareFunc } from '../types';
import { TranslateDynamicProps } from '../types';

export const FillPlaceholdersMiddleware: MiddlewareFunc = (context, next) => {
    const { params, result, settings } = context;
    const value = result.value;
    const dynamicProps = params.dynamicProps;

    if (
        !dynamicProps ||
        !value ||
        !testPlaceholder(value, context.settings?.$less)
    ) {
        return next();
    }

    const _settings = settings ?? globalSettings;
    var regexp = _settings.$less
        ? globalSettings.replacePlaceholdersRx_$less
        : globalSettings.replacePlaceholdersRx;
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
        _settings
    );

    result.value = replaced;
    next();
};
