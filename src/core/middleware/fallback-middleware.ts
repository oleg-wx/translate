import { MiddlewareFunc } from '../types';

export const FallbackMiddleware: MiddlewareFunc = ({ params, result }) => {
    if (!result.value) {
        if (typeof params.fallback === 'string') {
            result.value = params.fallback;
        } else if (typeof params.fallback?.value === 'string') {
            result.value = params.fallback.value;
            result.plurals = params.fallback.plural;
            result.entry = params.fallback;
        } else {
            result.value = params.key?.asString ?? '';
        }
        result.fallingBack = true;
    }
};
