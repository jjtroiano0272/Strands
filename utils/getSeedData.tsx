eimport {
  comments as dummyComments,
  dummyFormulas,
  images as dummyImages,
} from '../constants/dummyData';
import { faker } from '@faker-js/faker';
import axios from 'axios';
import { useState } from 'react';

export const getSeedData = (
  length = 1,
  outputType: 'log' | 'json' | 'csv' = 'log'
) => {
  const [auth, setAuth] = useState({
    displayName: '',
    profileImage: '',
    uid: '',
  });
  const [clientName, setClientName] = useState<string | undefined>('');
  const [comments, setComments] = useState<string | undefined>();
  const [createdAt, setCreatedAt] = useState<Date | number | undefined>();
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [media, setMedia] = useState({ image: [''], video: [''] });
  const [rating, setRating] = useState<number | undefined>();
  const [formulaTypes, setFormulaTypes] = useState([
    'aveda',
    'redken',
    'tramesi',
    'goldwell',
  ]);

  const randomNaturalNumber = (a: number, b: number) => {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  };

  let result = Array<{}>(length);
  for (let i = 0; i < length; i++) {
    const randUid = faker.random.alphaNumeric(28, { casing: 'mixed' }); // to ensure the fields match and don't re-randomize
    result.push({
      auth: {
        displayName: faker.name.firstName(),
        profileImage:
          Math.random() < 0.2
            ? `https://api.dicebear.com/6.x/lorelei/png/seed=${randUid}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`
            : faker.image.imageUrl(50, 50, 'portrait', true),
        uid: randUid, //28 character alphanumeric string
      },
      createdAt: faker.date.recent(30),
      comments:
        dummyComments &&
        dummyComments[Math.floor(Math.random() * dummyComments.length)],
      rating: randomNaturalNumber(1, 5),
      isSeasonal: Math.random() < 0.5,
      // productsUsed,
      // downloadURL,
      geolocation: {
        lat: faker.address.nearbyGPSCoordinate(
          [26.44013651808517, -81.77211439025608],
          50,
          true
        )[0],
        lng: faker.address.nearbyGPSCoordinate(
          [26.44013651808517, -81.77211439025608],
          50,
          true
        )[1],
      },
      formula: {
        type: dummyFormulas.types[
          Math.floor(Math.random() * dummyFormulas.types.length)
        ],
        description:
          dummyFormulas.descriptions[
            Math.floor(Math.random() * dummyFormulas.descriptions.length)
          ],
      },
      clientName: faker.name.firstName(),
      // downloadURL: randRedditImg,
      media: {
        image: Array(randomNaturalNumber(1, 5))
          .fill(null)
          .map(() => faker.image.imageUrl(300, 300, 'hairStylist', true)),
        video: [],
      },
    });
  }

  return result.filter(el => el !== null);
};
