require("dotenv").config();
const { Pool } = require("pg");

//connectionString: process.env.DB_CONNECTION,
const pool = new Pool({
 connectionString:process.env.DB
});

async function init() {
    const client = await pool.connect();
    await client.query({
      text: `
      CREATE TABLE IF NOT EXISTS usuarios (
        email VARCHAR(255) PRIMARY KEY NOT NULL,
        nombre VARCHAR(40) NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS categoria (
        id SERIAL PRIMARY KEY ,
        nombre VARCHAR(255) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS noticias (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(60) NOT NULL,
        texto TEXT NOT NULL,
        imagen VARCHAR(255) NOT NULL,
        autor VARCHAR(255) REFERENCES usuarios(email) NOT NULL,
        categoria_id INTEGER REFERENCES categoria(id) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS comentarios (
        id SERIAL PRIMARY KEY ,
        texto TEXT NOT NULL,
        autor VARCHAR(255) REFERENCES usuarios(email) NOT NULL,
        noticia_id INTEGER REFERENCES noticias(id) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        autor VARCHAR(255) REFERENCES usuarios(email) NOT NULL,
        noticia_id INTEGER REFERENCES noticias(id) NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS dislikes (
        id SERIAL PRIMARY KEY,
        autor VARCHAR(255) REFERENCES usuarios(email) NOT NULL,
        noticia_id INTEGER REFERENCES noticias(id)NOT NULL
    );
    
      `,
    });
    client.release();
  }
  
module.exports = { pool, init };
  
