import { Translations } from '..';

const LANG = 'en';
const KEY = 'clean-${numberOfRooms}-rooms-at-${numberOfFloors}';

const translations = new Translations({
    [LANG]: {
        [KEY]: {
            value: 'clean ${numberOfRooms} at ${numberOfFloors}.',
            plural: {
                // No `_` rule: anything other than 0 falls through to the raw number.
                numberOfRooms: [['= 0', 'no rooms']],
            },
            description: 'blah',
        },
    },
});

describe('when a plural has no default rule', () => {
    it.each([
        { props: { numberOfRooms: 0, numberOfFloors: 3 }, expected: 'clean no rooms at 3.' },
        { props: { numberOfRooms: 1, numberOfFloors: 2 }, expected: 'clean 1 at 2.' },
    ])('$props.numberOfRooms rooms → "$expected"', ({ props, expected }) => {
        expect(translations.translateTo(LANG, KEY, props)).toBe(expected);
    });
});
