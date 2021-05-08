/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();  //this setups up the express server

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => { //we're visiting my home screen of our api
  res.send('D&D Monsters API'); //.send is an express method that allows us to send a string & print to page
});

// API routes,

// Authorization
app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body; //in our request we get something with a .body
    //go to our db and make this query below
    const data = await client.query(`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
    `, [user.name, user.email, user.passwordHash]); //2nd argument of query function. Send the name, email, and password to the db
    
    res.json(data.rows[0]); //this is filled with id, name, email on 33
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/monsters', async (req, res) => {
  try {
    const monster = req.body;

    const data = await client.query(`
      INSERT INTO monsters (name, type, hp, ac, cr, is_legendary, img_url, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, type, hp, ac, cr, is_legendary as "isLegendary", img_url, user_id as "userId";
    `, [monster.name, monster.type, monster.hp, monster.ac, monster.cr, monster.isLegendary, monster.img_url, monster.userId]);
    
    res.json(data.rows[0]);
  }

  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

app.put('/api/monsters/:id', async (req, res) => { //this :id lets us update a monster by its postgres id
  try {
    const monster = req.body;

    const data = await client.query(`
    UPDATE monsters
    SET name = $1, type = $2, hp = $3, ac = $4, 
        cr = $5, is_legendary = $6, img_url = $7
    WHERE id = $8
    RETURNING id, name, type, hp, ac, cr, is_legendary as "isLegendary", img_url, user_id as "userId";
    `, [monster.name, monster.type, monster.hp, monster.ac, monster.cr, 
      monster.isLegendary, monster.img_url, req.params.id]); //req.params.id corresponds to :id in 63
    //lines 73 & 74 prevents SQL injection attacks - otherwise we could insert ${var} in the SQL above
    //line 72 returns the rows that were changed as specified in RETURNING
    res.json(data.rows[0]); //we wrote to the db and get back the changed state "this is what we wrote to the db." 
  }

  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });      
  }
});

app.delete('/api/monsters/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM monsters
      WHERE id = $1
      RETURNING id, name, type, hp, ac, cr, is_legendary as "isLegendary", img_url, user_id as "userId";
    `, 
    [req.params.id]);

    res.json(data.rows[0]);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/monsters', async (req, res) => {
  // use SQL query to get data...
  let data;
  try {
    if (req.query.name){
      data = await client.query(`
        SELECT  m.id, m.name,
                type, hp, ac, cr,
                is_legendary as "isLegendary",
                img_url,
                user_id as "userId", 
                u.name as "userName"
        FROM    monsters m
        JOIN    users u
        ON      m.user_id = u.id
        WHERE   m.name = $1;
      `,[req.query.name]);
    } else {
      data = await client.query(`
        SELECT  m.id, m.name,
                type, hp, ac, cr,
                is_legendary as "isLegendary",
                img_url,
                user_id as "userId", 
                u.name as "userName"
        FROM    monsters m
        JOIN    users u
        ON      m.user_id = u.id;
      `);
    }

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.get('/api/monsters/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  m.id, m.name, type, hp, ac, cr,
              is_legendary as "isLegendary", img_url,
              user_id as "userId",
              u.name as "userName"
      FROM    monsters m
      JOIN    users u
      ON      m.user_id = u.id
      WHERE   m.id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

export default app;