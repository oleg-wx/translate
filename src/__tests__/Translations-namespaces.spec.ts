import { Dictionary, Translations } from '..';

let translations: Translations;

beforeEach(() => {
    const dics = {
        'en-US': {
            user: {
                'hello_${user}': 'Hello ${user?User}!',
            },
            admin: {
                hello: 'Hello $&{user}!',
                user: 'Admin',
            },
        },
    };
    translations = new Translations(dics);
});

test('Translate with namespace', () => {
    translations.lang = 'en-US';
    const translated = translations.translate(['user', 'hello_${user}'], {
        user: undefined!,
    });
    expect(translated).toBe('Hello User!');
});

test('TranslateTo with namespace', () => {
    const translated = translations.translateTo('en-US', 'user.hello_${user}', {
        user: undefined!,
    });
    expect(translated).toBe('Hello User!');
});

test('TranslateTo with namespace and replace with namespace', () => {
    const translated = translations.translateTo('en-US', 'admin.hello', {
        user: 'admin.user',
    });
    expect(translated).toBe('Hello Admin!');
});
