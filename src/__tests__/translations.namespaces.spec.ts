import { Translations } from '..';

const LANG = 'en-US';

describe('when addressing namespaced keys', () => {
    let translations: Translations;

    beforeEach(() => {
        translations = new Translations({
            [LANG]: {
                user: {
                    'hello_${user}': 'Hello ${user?User}!',
                },
                admin: {
                    hello: 'Hello $&{user}!',
                    user: 'Admin',
                },
            },
        });
    });

    it('accepts the key as a [namespace, key] array', () => {
        translations.lang = LANG;

        expect(translations.translate(['user', 'hello_${user}'], { user: undefined! })).toBe('Hello User!');
    });

    it('accepts the key as a dotted path', () => {
        expect(translations.translateTo(LANG, 'user.hello_${user}', { user: undefined! })).toBe('Hello User!');
    });

    it('resolves a translated placeholder through its own namespace path', () => {
        expect(translations.translateTo(LANG, 'admin.hello', { user: 'admin.user' })).toBe('Hello Admin!');
    });
});
