import { Translations } from "..";
import { Dictionary } from "../Translations";

let key = "clean-rooms-at-floors";
let cache: { [key: string]: string } = {};
let dictionary: Dictionary = {
  [key]: {
    value: "clean ${numberOfRooms} at ${numberOfFloors}",
    plural: {
      numberOfRooms: [
        ["= 0", "no rooms"],
        ["_", "{$} rooms"],
      ],
      numberOfFloors: [
        ["= 0", "zero floors"],
        ["_", "{$} floors"],
      ],
    },
    description: "blah",
  },
};
let translations = new Translations(undefined, { cacheDynamic: true });

let values = [
  {
    numberOfRooms: 3,
    numberOfFloors: 3,
  },
  {
    numberOfRooms: 0,
    numberOfFloors: 0,
  },
];

let expected = ["clean 3 rooms at 3 floors", "clean no rooms at zero floors"];

beforeEach(() => {});

values.forEach((v, i) => {
  test("translate plural " + expected[i], () => {
    expect(translations.use(dictionary, cache)(key, v)).toBe(expected[i]);
  });
});

test("cached", () => {
  expect(Object.keys(translations.dynamicCache).length).toBe(0);
  expect(Object.keys(cache).length).toBe(2);
});
