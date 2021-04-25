import { Translations } from "..";

let lang = "en";
let key = "clean-{numberOfRooms}-rooms-at-{numberOfFloors}";
let translations = new Translations(
  {
    [lang]: {
      [key]: {
        value: "clean {numberOfRooms} at {numberOfFloors}",
        plural: {
          numberOfRooms: [
            ["= 0", "no rooms"],
            ["= 1", "1 room"],
            ["> 100", "many rooms"],
            ["> 1", "{$} rooms"],
            ["_", "{$} rooms"],
          ],
          numberOfFloors: [
            ["= 0", "zero floors"],
            ["= 1", "one floor"],
            ["_", "{$} floors"],
          ],
        },
        description: "blah",
      },
    },
  },
  false,
  true
);

let values = [
  {
    numberOfRooms: 0,
    numberOfFloors: 3,
  },
  {
    numberOfRooms: 1,
    numberOfFloors: 2,
  },
  {
    numberOfRooms: 115,
    numberOfFloors: 20,
  },
  {
    numberOfRooms: 12,
    numberOfFloors: 1,
  },
  {
    numberOfRooms: 0,
    numberOfFloors: 0,
  },
  {
    numberOfRooms: 0,
    numberOfFloors: 3,
  },
];

let expected = [
  "clean no rooms at 3 floors",
  "clean 1 room at 2 floors",
  "clean many rooms at 20 floors",
  "clean 12 rooms at one floor",
  "clean no rooms at zero floors",
  "clean no rooms at 3 floors",
];

beforeEach(() => {});

values.forEach((v, i) => {
  test("translate plural " + expected[i], () => {
    expect(translations.translate(lang, key, v)).toBe(expected[i]);
  });
});

test("cached", () => {
  console.log(translations.dynamicCache);
  expect(Object.keys(translations.dynamicCache).length).toBe(5);
});
