import { replacePlaceholders } from "./replacePlaceholders";

describe('when replacing placeholders', () => {
    it('should replace placeholders with provided values', () => {
        expect(
            replacePlaceholders("at ${time}", { 'time': '10:00' }, (a)=>a,(v,p)=>''+v)
        ).toBe('at 10:00');
    });
});
