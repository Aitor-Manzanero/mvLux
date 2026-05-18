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

