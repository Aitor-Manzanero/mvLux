import pool from "../db/DBConnection.js";
import { Film } from "../models/film.js";
import { findMainFilmInfo } from "../models/film.js";
import { mapFilmToDTO } from "../mappers/file.mapper.js";


export async function findFilmsByName(name: string): Promise<Film[]> {
  const sql = `
  SELECT id, original_title 
  FROM film 
  WHERE original_title LIKE ?
  `;
  const [rows] = await pool.execute<Film[]>(sql, [`%${name}%`]);
  return rows;
}

export async function findFilmsByDirector(name: string) {
  const sql = `
    SELECT f.original_title
    FROM director d
    JOIN film_director fd ON d.id = fd.director_id
    JOIN film f ON fd.film_id = f.id
    WHERE d.complete_name LIKE ?
  `;
}
//cambie la consulta para hacer select al genero tambien y que no se repitan peliculas, 
// solo lo hace por ahora con generos para que aparezcan agrupadas por genero en el frontend,
// el mapper usa lo que hay en el select, para tenerlo en cuenta en proximas consultas
  export async function findFilmInfoMainPannel(name: string) {
    const sql = `
    SELECT
    f.original_title,
    f.release_date,
    d.complete_name,
    MIN(c.name) AS company,
    f.duration,
    f.overview,
    g.genre_name
FROM film f

LEFT JOIN film_genre fg ON f.id = fg.film_id
LEFT JOIN genre g ON fg.genre_id = g.id

LEFT JOIN film_company fc ON fc.film_id = f.id
LEFT JOIN company c ON c.id = fc.company_id

LEFT JOIN film_director fd ON fd.film_id = f.id
LEFT JOIN director d ON d.id = fd.director_id

GROUP BY
    f.id,
    g.genre_name,
    f.original_title,
    f.release_date,
    d.complete_name,
    f.duration,
    f.overview;
        `;
    const [rows] = await pool.execute<findMainFilmInfo[]>(sql, [`%${name}%`]);
      return rows.map(mapFilmToDTO);
  }

