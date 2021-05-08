/* eslint-disable no-console */
// `npm i dotenv` reads .env file into process.env
import dotenv from 'dotenv';
dotenv.config(); //config the .env for this page

// `npm i pg` - official postgres node client
import pg from 'pg';
// Use the pg Client
const Client = pg.Client; //this is a class

// note: you will need to create the database 
// if not part of connection string!
const client = new Client({ //we are connecting to the dev database in .env
  connectionString: process.env.DATABASE_URL, //the connection string in the .env
  ssl: process.env.PGSSLMODE && { rejectUnauthorized: false } // on heroku, ssl required
});

// open the connection to the db
client.connect().then(() => { //connect to the dev database
  const { database, host, port } = client; //get this stuff out of client and assign to vars. 
  // console.log(client); do this to see what's in client
  console.log(`Connected to pg database ${database} on ${host}:${port}`); //verify we connected to the db
});

// then client object is the export
export default client;