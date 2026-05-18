import pool from "../db/DBConnection.js";
import { findFilmsByName } from "../models/film.js";
import { findMainFilmInfo } from "../models/film.js";
import { mapFilmToDTO,  mapFilmToDTOSearch} from "../mappers/file.mapper.js";


export async function findFilmsByName(name: string){
  const sql = `
 SELECT
    f.original_title,
    f.release_date,
    d.complete_name,
    MIN(c.name) AS company,
    f.duration,
    f.overview
    FROM film f

    LEFT JOIN film_genre fg ON f.id = fg.film_id
    LEFT JOIN genre g ON fg.genre_id = g.id

    LEFT JOIN film_company fc ON fc.film_id = f.id
    LEFT JOIN company c ON c.id = fc.company_id

    LEFT JOIN film_director fd ON fd.film_id = f.id
    LEFT JOIN director d ON d.id = fd.director_id
    where f.original_title LIKE ?

    GROUP BY
        f.id,
        f.original_title,
        f.release_date,
        d.complete_name,
        f.duration,
        f.overview;
  `;
  const [rows] = await pool.execute<findFilmsByName[]>(sql, [`%${name}%`]);
      return rows.map(mapFilmToDTOSearch);
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
      f.duration, 
      f.overview,
    
      (
          SELECT JSON_ARRAYAGG(d.complete_name)
          FROM film_director fd
          JOIN director d ON d.id = fd.director_id
          WHERE fd.film_id = f.id
      ) AS directors,

      (
          SELECT JSON_ARRAYAGG(c.name)
          FROM film_company fc
          JOIN company c ON c.id = fc.company_id
          WHERE fc.film_id = f.id
      ) AS companies,

      (
          SELECT JSON_ARRAYAGG(g.genre_name)
          FROM film_genre fg
          JOIN genre g ON g.id = fg.genre_id
          WHERE fg.film_id = f.id
      ) AS genres

      FROM film f
      WHERE EXISTS (
          SELECT 1
          FROM film_genre fg
          JOIN genre g ON g.id = fg.genre_id
          WHERE fg.film_id = f.id
            AND g.genre_name = $1
      )
      ORDER BY f.vote_avg DESC
      LIMIT 10;
        `;
    const [rows] = await pool.execute<findMainFilmInfo[]>(sql, [`%${name}%`]);
      return rows.map(mapFilmToDTO);
  }

