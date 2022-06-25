import { CachedResult, MiddlewareFunc } from '../types';

export const AddToDynamicCacheMiddleware: MiddlewareFunc<CachedResult> = (
    { params, result },
    next
) => {
    if (!result.entry || !result.value || result.fallingBack) {
        return next();
    }

    const dynamicCache = params.dynamicCache;
    const dynamicKey = result.dynamicKey;

    if (!dynamicCache || !dynamicKey) {
        return next();
    }

    const value = result.value;

    // cache translation
    if (!dynamicCache[params.lang]) dynamicCache[params.lang] = {};
    dynamicCache[params.lang][`${dynamicKey}`] = value;

    next();
};
