import { testPlaceholder } from '../globalSettings';
import {
    TranslateDynamicProps,
} from '../types';
import { CachedResult, MiddlewareFunc } from '../types';

function createDynamicKey(key: string, dynamicProps: TranslateDynamicProps) {
    return `${key}::${JSON.stringify(dynamicProps).replace(/[\"\{\}]/g, '')}`;
}

export const GetFromDynamicCacheMiddleware: MiddlewareFunc<CachedResult> = (
    { params, result, settings },
    next
) => {
    if (!result.entry || result.fallingBack) {
        return next();
    }

    const dynamicProps = params.dynamicProps;
    const value = result.value;

    if (!dynamicProps || !value || !testPlaceholder(value,settings?.$less)) {
        return next();
    }

    const dynamicCache = params.dynamicCache;

    // trying to get dynamic cache
    let dynamicKey: string | undefined;
    if (dynamicCache && dynamicProps) {
        dynamicKey = createDynamicKey(value, dynamicProps);
        if (Object.prototype.hasOwnProperty.call(dynamicCache, dynamicKey)) {
            result.value = dynamicCache[params.lang][dynamicKey];
            result.fromCache = true;
        }
        result.dynamicKey = dynamicKey;
    }
    return next();
};
