import { findMainFilmInfo } from "../models/film.js";
import { FilmDTO } from "../dto/film.dto.js";

export const mapFilmToDTO = (film: findMainFilmInfo): FilmDTO => ({
  section: "Tendencias",
  title: film.original_title,
  year: new Date(film.release_date).getFullYear(),
  poster: `https://i.ytimg.com/vi/P-DvQaV9gNI/maxresdefault.jpg`,
  director: film.name,
  country: "USA",
  studio: film.complete_name,
  duration: film.duration,
  synopsis: film.overview
});