const { pool } = require('../config/db.js');

async function agregarNoticia(titular,cuerpo,imagen,nombre,categoria){
    const client = await pool.connect();
    await client.query({
        text: "insert into noticias (titulo, texto, imagen, autor, categoria_id)  values ($1,$2,$3,$4,$5)",
        values: [titular,cuerpo,imagen,nombre,categoria]
    });
    client.release();
}

async function dataNoticias(){
    const client = await pool.connect();
    const respuesta=await client.query({
        text: `
        SELECT noticias.id, noticias.titulo, noticias.texto, noticias.imagen, noticias.fecha_creacion, categoria.nombre AS categoria, usuarios.nombre AS autor, 
        COUNT(DISTINCT likes.id) AS num_likes, COUNT(DISTINCT dislikes.id) AS num_dislikes, COUNT(DISTINCT comentarios.id) AS num_comentarios
        FROM noticias
        JOIN categoria ON noticias.categoria_id = categoria.id
        JOIN usuarios ON noticias.autor = usuarios.email
        LEFT JOIN likes ON noticias.id = likes.noticia_id
        LEFT JOIN dislikes ON noticias.id = dislikes.noticia_id
        LEFT JOIN comentarios ON noticias.id = comentarios.noticia_id
        GROUP BY noticias.id, categoria.nombre, usuarios.nombre
        ORDER BY noticias.fecha_creacion DESC;`
    });
    client.release();
    return respuesta.rows
}
async function buscarCorreo(email){
    const client = await pool.connect();
    const respuesta= await client.query({
        text: 'select * from usuarios where email = $1',
        values: [email]
    });
    client.release();
    return respuesta.rows

}

async function dataNoticiaId(id){
    const client = await pool.connect();
    const respuesta=await client.query({
        text: `
        SELECT noticias.id, noticias.titulo, noticias.texto, noticias.imagen, noticias.fecha_creacion, categoria.nombre AS categoria, usuarios.nombre AS autor, 
        COUNT(DISTINCT likes.id) AS num_likes, COUNT(DISTINCT dislikes.id) AS num_dislikes, COUNT(DISTINCT comentarios.id) AS num_comentarios
        FROM noticias
        JOIN categoria ON noticias.categoria_id = categoria.id
        JOIN usuarios ON noticias.autor = usuarios.email
        LEFT JOIN likes ON noticias.id = likes.noticia_id
        LEFT JOIN dislikes ON noticias.id = dislikes.noticia_id
        LEFT JOIN comentarios ON noticias.id = comentarios.noticia_id
        WHERE noticias.id = $1
        GROUP BY noticias.id, categoria.nombre, usuarios.nombre
        ORDER BY noticias.fecha_creacion DESC;`,
        values: [id]
    });
    client.release();
    return respuesta.rows[0]
}


module.exports={agregarNoticia,dataNoticias,dataNoticiaId,buscarCorreo}