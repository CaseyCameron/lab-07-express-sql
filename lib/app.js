/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('D&D Monsters API');
});

// API routes,

// Authorization
app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
    `, [user.name, user.email, user.passwordHash]);
    
    res.json(data.rows[0]);
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

app.put('/api/monsters/:id', async (req, res) => {
  try {
    const monster = req.body;

    const data = await client.query(`
    UPDATE monsters
    SET name = $1, type = $2, hp = $3, ac = $4, 
        cr = $5, is_legendary = $6, img_url = $7
    WHERE id = $8
    RETURNING id, name, type, hp, ac, cr, is_legendary as "isLegendary", img_url, user_id as "userId";
    `, [monster.name, monster.type, monster.hp, monster.ac, monster.cr, 
      monster.isLegendary, monster.img_url, req.params.id]);
    
    res.json(data.rows[0]);
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
      RETURNING id, name, type, hp, ac, cr, is_legendary as "isLegendary", img_url;
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
  try {
    const data = await client.query(`
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
      SELECT  id,
              name,
              type,
              hp,
              AC,
              cr,
              is_legendary as "isLegendary",
              img_url
      FROM    monsters
      WHERE   id = $1;
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