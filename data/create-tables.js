/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        password_hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE monsters (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        type VARCHAR(512) NOT NULL,
        hp INTEGER NOT NULL,
        ac INTEGER NOT NULL,
        cr FLOAT NOT NULL,
        is_legendary BOOLEAN DEFAULT FALSE,
        img_url VARCHAR(1024) NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `); //line 21 it creates a unique id for the monster row item

    console.log('create tables complete');
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}