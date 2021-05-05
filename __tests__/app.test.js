import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedMonsters = [
    {
      id: expect.any(Number),
      name: 'Aboleth',
      type: 'aberration',
      hp: 135,
      ac: 17,
      cr: 10,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/11/1000/1000/636238825975375671.jpeg'
    },
    {
      id: expect.any(Number),
      name: 'Acolyte',
      type: 'aberration',
      hp: 9,
      ac: 10,
      cr: .25,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/656/humanoid.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Adult Black Dragon',
      type: 'dragon',
      hp: 195,
      ac: 19,
      cr: 14,
      isLegendary: true,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/13/1000/1000/636238871029832086.jpeg'
    },
    {
      id: expect.any(Number),
      name: 'Allosaurus',
      type: 'large beast',
      hp: 51,
      ac: 13,
      cr: 2,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/648/beast.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Ancient Black Dragon',
      type: 'dragon',
      hp: 367,
      ac: 22,
      cr: 21,
      isLegendary: true,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/129/315/315/636252755854649337.jpeg'
    },
    {
      id: expect.any(Number),
      name: 'Basilisk',
      type: 'monstrosity',
      hp: 52,
      ac: 15,
      cr: 3,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/185/1000/1000/636252762168821795.jpeg'
    },
    {
      id: expect.any(Number),
      name: 'Berserker',
      type: 'humanoid',
      hp: 67,
      ac: 13,
      cr: 2,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/656/humanoid.jpg'
    },
    {
      id: expect.any(Number),
      name: 'Chimera',
      type: 'monstrosity',
      hp: 114,
      ac: 14,
      cr: 6,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/237/1000/1000/636252766770156389.jpeg'
    }
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/monsters', async () => {
    // act - make the request
    const response = await request.get('/api/monsters');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedMonsters);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/monsters/:id', async () => {
    const response = await request.get('/api/monsters/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedMonsters[1]);
  });
});