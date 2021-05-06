/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import monsters from './monsters.js';
import users from './users.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [user.name, user.email, user.passwordHash])
      })
    );

      const user2 = data[0].rows[0];
      
      await Promise.all(
        monsters.map(monster => {
          return client.query(`
          INSERT INTO monsters (name, type, hp, ac, cr, is_legendary, img_url, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, 
          [monster.name, monster.type, monster.hp, monster.ac, monster.cr, monster.isLegendary, monster.img_url, user2.id])
        })
      );
      
      console.log('seed data load complete');
    }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}