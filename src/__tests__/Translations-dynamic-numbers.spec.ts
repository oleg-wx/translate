import { Translations } from "..";

let key = "days";
let translations = new Translations(
  {
    'en': {
      [key]: {
        value: "it is more then ${days}",
        plural:{
          days:[
            ['>183','half of year'],
            ['>93','three months'],
            ['_','{$} days']
          ]
        }
      },
    }
  }
);

let values = [
  {
    days:10
  },
  {
    days: 100
  },
  {
    days: 200
  },
  {
    days: 94
  },
  {
    days: 90
  },
  {
    days: 'blabla'
  }
];

let expected = [
  "it is more then 10 days",
  "it is more then three months",
  "it is more then half of year",
  "it is more then three months",
  "it is more then 90 days",
  "it is more then blabla",
];
values.forEach((v, i) => {
  test("translate plural numbers" + expected[i], () => {
    expect(translations.translate('en', key, v)).toBe(expected[i]);
  });
});
