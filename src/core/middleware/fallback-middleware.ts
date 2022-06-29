import { MiddlewareFunc } from '../types';

export const FallbackMiddleware: MiddlewareFunc = ({params,result}) => {
    if(!result.value){
        result.value = params.fallback ?? params.key?.asString ?? '';
        result.fallingBack = true;
    }
};
