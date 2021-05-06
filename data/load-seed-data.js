/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:

run();

async function run() {

  try {

    await client.query(`
          DROP TABLE IF EXISTS users CASCADE;
          DROP TABLE IF EXISTS monsters;
        `,);

      console.log('seed data load complete');
    }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}