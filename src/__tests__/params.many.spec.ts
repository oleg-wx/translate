import { Translations } from '..';

const LANG = 'en';
const KEY = 'clean-${numberOfRooms}-rooms-at-${numberOfFloors}';

const translations = new Translations({
    [LANG]: {
        [KEY]: {
            value: 'clean ${numberOfRooms} at ${numberOfFloors}. it was: $&{value}. meet ${people} person(s) in the ${building}',
            plural: {
                numberOfRooms: [['= 0', 'no rooms']],
                people: [
                    ['=0', 'no'],
                    ['_', '$#'],
                ],
            },
            description: 'blah',
        },
    },
});

describe('when a single entry mixes many params', () => {
    it.each([
        {
            props: {
                numberOfRooms: 0,
                numberOfFloors: 3,
                people: 2,
                building: 'white house',
                value: 'a description',
            },
            expected: 'clean no rooms at 3. it was: a description. meet 2 person(s) in the white house',
        },
        {
            props: {
                numberOfRooms: 1,
                numberOfFloors: 2,
                people: 0,
                // `floors` is not referenced by the entry and must simply be ignored.
                floors: 1,
                building: 'asylum',
                value: 'an action',
            },
            expected: 'clean 1 at 2. it was: an action. meet no person(s) in the asylum',
        },
    ])('→ "$expected"', ({ props, expected }) => {
        expect(translations.translateTo(LANG, KEY, props)).toBe(expected);
    });
});
