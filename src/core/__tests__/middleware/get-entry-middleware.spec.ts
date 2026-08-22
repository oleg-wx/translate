import { GetEntryMiddleware } from '../../middleware/get-entry-middleware';
import { Dictionaries, TranslateKey } from '../../types';
import { LANG, createContext } from '../_helpers/create-context';

const DICTIONARIES: Dictionaries = {
    [LANG]: {
        'my-key': 'my-entry',
        another_key: {
            value: 'another-entry',
            description: 'descr',
            plural: {},
        },
        space: {
            'my-key': 'my-entry',
        },
    },
};

const resolve = (key: TranslateKey) => {
    const context = createContext(key, { dictionaries: DICTIONARIES });
    GetEntryMiddleware(context);
    return context.result;
};

describe('GetEntryMiddleware', () => {
    it('reads a shorthand string entry', () => {
        const result = resolve('my-key');

        expect(result.value).toBe('my-entry');
        expect(result.entry).toBe('my-entry');
    });

    it('reads the value out of a full entry', () => {
        expect(resolve('another_key').value).toBe('another-entry');
    });

    it.each([
        { key: 'space.my-key', shape: 'a dotted key' },
        { key: ['space', 'my-key'], shape: 'an array key' },
    ])('reaches into a namespace with $shape', ({ key }) => {
        expect(resolve(key).value).toBe('my-entry');
    });

    it.each([
        { key: ['no-key'], shape: 'an unknown key' },
        { key: ['no', 'no-key'], shape: 'an unknown namespace' },
    ])('leaves the value unset for $shape', ({ key }) => {
        expect(resolve(key).value).toBeUndefined();
    });

    // Keys can come from anywhere, so the walk must never step outside the dictionary's own keys.
    it.each([
        { key: 'constructor', shape: 'a prototype property' },
        { key: 'constructor.name', shape: 'a string reachable on Object.prototype' },
        { key: '__proto__.constructor.name', shape: 'the same, reached through __proto__' },
        { key: 'toString', shape: 'an inherited method' },
        { key: 'my-key.0', shape: 'an index into an already resolved entry' },
        { key: 'my-key.length', shape: "a resolved entry's length" },
        { key: 'another_key.value.0', shape: "an index into an entry's value" },
    ])('does not resolve $shape ("$key")', ({ key }) => {
        expect(resolve(key).value).toBeUndefined();
    });
});
