import { findMainFilmInfo, findFilmsByName } from "../models/film.js";
import { FilmDTO } from "../dto/film.dto.js";

export const mapFilmToDTO = (film: findMainFilmInfo): FilmDTO => ({
  section: film.genre_name, //agrupa las peliculas por genero
  title: film.original_title,
  year: new Date(film.release_date).getFullYear(),
  poster: `https://i.ytimg.com/vi/P-DvQaV9gNI/maxresdefault.jpg`,
  director: film.complete_name,
  country: "USA",
  studio: film.company,
  duration: film.duration,
  synopsis: film.overview
});

export const mapFilmToDTOSearch = (film: findFilmsByName): FilmDTO => ({
  section: "Busqueda", //No estoy seguro si es la mejor forma de implementarlo, pero hago que se mapee asi para que no se agrupe por genero, sino que salgan todos juntos
  title: film.original_title,
  year: new Date(film.release_date).getFullYear(),
  poster: `https://i.ytimg.com/vi/P-DvQaV9gNI/maxresdefault.jpg`,
  director: film.complete_name,
  country: "USA",
  studio: film.company,
  duration: film.duration,
  synopsis: film.overview
});