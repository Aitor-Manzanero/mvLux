import { findMainFilmInfo } from "../models/film.js";
import { FilmDTO } from "../dto/film.dto.js";

export const mapFilmToDTO = (film: findMainFilmInfo): FilmDTO => ({
  section: film.genre_name, //agrupa las peliculas por genero
  title: film.original_title,
  year: new Date(film.release_date).getFullYear(),
  poster: `https://i.ytimg.com/vi/P-DvQaV9gNI/maxresdefault.jpg`,
  director: film.complete_name,
  country: "USA",
  studio: film.name,
  duration: film.duration,
  synopsis: film.overview
});