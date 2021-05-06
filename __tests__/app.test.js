import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/monsters', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          passwordHash: 'password'
        });

        expect(response.status).toBe(200);
        user = response.body;
    });
    
    let aboleth = {
      id: expect.any(Number),
      name: 'Aboleth',
      type: 'aberration',
      hp: 135,
      ac: 17,
      cr: 10,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/11/1000/1000/636238825975375671.jpeg'
    };

    let berserker =   {
      id: expect.any(Number),
      name: 'Berserker',
      type: 'humanoid',
      hp: 67,
      ac: 13,
      cr: 2,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/656/humanoid.jpg'
    };

    let chimera =   {
      id: expect.any(Number),
      name: 'Chimera',
      type: 'monstrosity',
      hp: 114,
      ac: 14,
      cr: 6,
      isLegendary: false,
      img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/237/1000/1000/636252766770156389.jpeg'
    };

    it('POST aboleth to /api/monsters', async () => {
      aboleth.userId = user.id;
      const response = await request
        .post('/api/monsters')
        .send(aboleth);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(aboleth);

      aboleth = response.body;
    });

    it('PUT updated aboleth into /api/monsters/:id', async () => {
      aboleth.ac = 30;
      aboleth.type = 'badass';

      const response = await request
        .put(`/api/monsters/${aboleth.id}`)
        .send(aboleth);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(aboleth);
    });
    
    it('GET list of monsters form /api/monsters', async () => {
      berserker.userId = user.id;
      const r1 = await request.post('/api/monsters').send(berserker);
      berserker = r1.body;

      chimera.userId = user.id;
      const r2 = await request.post('/api/monsters').send(chimera);
      chimera = r2.body;
      
      const response = await request.get('/api/monsters');
      
      expect(response.status).toBe(200);

      const expected = [aboleth, berserker, chimera].map(monster => {
        return {
          userName: user.name,
          ...monster
        };
      });

      expect(response.body).toEqual(expect.arrayContaining(expected));
    });
    
    it('GET chimera from /api/monsters/:id', async () => {
      const response = await request.get(`/api/monsters/${chimera.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...chimera, userName: user.name });
    });
    
    it('DELETE chimera from /api/monsters', async () => {
      const response = await request.delete(`/api/monsters/${chimera.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(chimera);
      
      const getResponse = await request.get('/api/monsters');
      expect(response.status).toBe(200);
      expect(getResponse.body.find(monster => monster.id ===chimera.id)).toBeUndefined();
    });

  });
});
// describe('API Routes', () => {

//   beforeAll(() => {
//     execSync('npm run setup-db');
//   });

//   afterAll(async () => {
//     return client.end();
//   });

//   const expectedMonsters = [
//     {
//       id: expect.any(Number),
//       name: 'Aboleth',
//       type: 'aberration',
//       hp: 135,
//       ac: 17,
//       cr: 10,
//       isLegendary: false,
//       img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/11/1000/1000/636238825975375671.jpeg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Acolyte',
//       type: 'aberration',
//       hp: 9,
//       ac: 10,
//       cr: .25,
//       isLegendary: false,
//       img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/656/humanoid.jpg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Adult Black Dragon',
//       type: 'dragon',
//       hp: 195,
//       ac: 19,
//       cr: 14,
//       isLegendary: true,
//       img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/13/1000/1000/636238871029832086.jpeg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Allosaurus',
//       type: 'large beast',
//       hp: 51,
//       ac: 13,
//       cr: 2,
//       isLegendary: false,
//       img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/648/beast.jpg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Ancient Black Dragon',
//       type: 'dragon',
//       hp: 367,
//       ac: 22,
//       cr: 21,
//       isLegendary: true,
//       img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/129/315/315/636252755854649337.jpeg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Basilisk',
//       type: 'monstrosity',
//       hp: 52,
//       ac: 15,
//       cr: 3,
//       isLegendary: false,
//       img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/185/1000/1000/636252762168821795.jpeg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Berserker',
//       type: 'humanoid',
//       hp: 67,
//       ac: 13,
//       cr: 2,
//       isLegendary: false,
//       img_url: 'https://media-waterdeep.cursecdn.com/attachments/2/656/humanoid.jpg'
//     },
//     {
//       id: expect.any(Number),
//       name: 'Chimera',
//       type: 'monstrosity',
//       hp: 114,
//       ac: 14,
//       cr: 6,
//       isLegendary: false,
//       img_url: 'https://media-waterdeep.cursecdn.com/avatars/thumbnails/0/237/1000/1000/636252766770156389.jpeg'
//     }
//   ];

//   // If a GET request is made to /api/cats, does:
//   // 1) the server respond with status of 200
//   // 2) the body match the expected API data?
//   it('GET /api/monsters', async () => {
//     // act - make the request
//     const response = await request.get('/api/monsters');

//     // was response OK (200)?
//     expect(response.status).toBe(200);

//     // did it return the data we expected?
//     expect(response.body).toEqual(expectedMonsters);

//   });

//   // If a GET request is made to /api/cats/:id, does:
//   // 1) the server respond with status of 200
//   // 2) the body match the expected API data for the cat with that id?
//   test('GET /api/monsters/:id', async () => {
//     const response = await request.get('/api/monsters/2');
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(expectedMonsters[1]);
//   });
// });