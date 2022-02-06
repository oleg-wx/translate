import { Translations } from '..';

describe('when registering failures', () => {
    const dics = {
        'en-US': {
            hello: 'Hello',
        },
        'ru-RU': {
            bye: 'Пока',
        },
    };
    const onFail = jest.fn();
    const translations = new Translations(dics, {
        defaultLang: 'en-US',
        fallbackLang: 'ru-RU',
        onFailure: onFail,
    });

    it('should call on fail', ()=>{
        onFail.mockClear();
        const result = translations.translate('bye');
        expect(result).toBe('Пока');
        expect(onFail.mock.calls[0][0]).toBe('en-US');
        expect(onFail.mock.calls[0][1]).toBe('bye');
        expect(onFail.mock.calls.length).toBe(1);
    });

    it('should call on fail', ()=>{
        onFail.mockClear();
        const result = translations.translate('nope');
        expect(result).toBe('nope');
        expect(onFail.mock.calls[0][0]).toBe('en-US');
        expect(onFail.mock.calls[0][1]).toBe('nope');
        expect(onFail.mock.calls[1][0]).toBe('ru-RU');
        expect(onFail.mock.calls[1][1]).toBe('nope');
        expect(onFail.mock.calls.length).toBe(2);
    });
});
