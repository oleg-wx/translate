import { RegExpResult, TranslateDynamicProps } from '../types';
import { CachedResult, MiddlewareFunc } from '../types';

function createDynamicKey(key: string, dynamicProps: TranslateDynamicProps) {
    return `${key}::${JSON.stringify(dynamicProps).replace(/[\"\{\}]/g, '')}`;
}

export const GetDynamicFromCacheMiddleware: MiddlewareFunc<CachedResult & RegExpResult> = (
    { params, result },
    next
) => {
    if (!result.entry || result.fallingBack) {
        return next();
    }

    const dynamicProps = params.dynamicProps;
    const dynamicCache = params.dynamicCache;
    const value = result.value;

    if (!dynamicCache || !value || !result._testPlaceholder(value)) {
        return next();
    }

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
