/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import monsters from './monsters.js';

run();

async function run() {

  try {

    await Promise.all(
      monsters.map(monster => {
        return client.query(`
          INSERT INTO monsters (name, type, hp, AC, cr, is_legendary, img_url)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [monster.name, monster.type, monster.hp, monster.ac, monster.cr, monster.isLegendary, monster.img_url]);
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