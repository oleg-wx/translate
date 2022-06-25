import { Translations } from '..';

describe('when just adding many params', () => {
    let lang = 'en';
    let key = 'clean-${numberOfRooms}-rooms-at-${numberOfFloors}';
    let translations = new Translations(
        {
            [lang]: {
                [key]: {
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
        },
        { cacheDynamic: true }
    );

    let values = [
        {
            numberOfRooms: 0,
            numberOfFloors: 3,
            people: 2,
            building: 'white house',
            value: 'a description',
        },
        {
            numberOfRooms: 1,
            numberOfFloors: 2,
            people: 0,
            floors: 1,
            building: 'asylum',
            value: 'an action',
        },
    ];

    let expected = [
        'clean no rooms at 3. it was: a description. meet 2 person(s) in the white house',
        'clean 1 at 2. it was: an action. meet no person(s) in the asylum',
    ];

    beforeEach(() => {});

    it('should just translate', () => {
        values.forEach((v, i) => {
            expect(translations.translateTo(lang, key, v)).toBe(expected[i]);
        });
    });
});
