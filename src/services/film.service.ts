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
    select f.original_title, f.release_date, d.complete_name, c.name, f.duration, f.overview
      from film f
      LEFT JOIN film_genre fg on f.id = fg.film_id
      LEFT JOIN genre g on fg.genre_id = g.id
      LEFT JOIN film_actor fa on fa.film_id = f.id
      LEFT JOIN actor a on fa.actor_id = a.id
      LEFT JOIN film_company fc on fc.film_id = f.id
      LEFT JOIN company c on c.id = fc.company_id
      LEFT JOIN film_director fd on fd.film_id = f.id
      LEFT JOIN director d on d.id = fd.director_id
      LIMIT 1;
        `;
    const [rows] = await pool.execute<findMainFilmInfo[]>(sql, [`%${name}%`]);
      return rows.map(mapFilmToDTO);
  }

