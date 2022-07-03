import { MiddlewareFunc } from '../types';

export const FallbackMiddleware: MiddlewareFunc = ({ params, result }) => {
    if (!result.value) {
        result.fallingBack = true;
        if (typeof params.fallback === 'string') {
            result.value = params.fallback;
        } else if (typeof params.fallback?.value === 'string') {
            result.value = params.fallback.value;
            result.plurals = params.fallback.plural;
            result.cases = params.fallback.cases;
            result.entry = params.fallback;
        } else {
            result.fallingBackToKey = true;
            result.value = params.key?.asString ?? '';
        }
    }
};
