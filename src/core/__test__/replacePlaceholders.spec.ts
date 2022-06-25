import globalSettings from '../globalSettings';
import { replacePlaceholders } from '../_replacePlaceholders';

describe('when replacing placeholders', () => {
    it('should replace placeholders with provided values', () => {
        const res = replacePlaceholders(
            globalSettings.replacePlaceholdersRx,
            'at ${time}',
            undefined,
            { time: '10:00' },
            (key, props, fallback) => key,
            (v, p) => '' + v,
            { $less: false }
        );
        expect(res).toBe('at 10:00');
    });
});
