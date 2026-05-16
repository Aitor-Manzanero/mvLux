import { RowDataPacket } from "mysql2/promise";

export interface findFilmsByName extends RowDataPacket {
  original_title: string;
  release_date: string;
  complete_name: string;
  company: string; // Nombre de la productora
  duration: string;
  overview: string;
}

export interface findFilmsByDirector extends RowDataPacket {
  original_title: string;
}

export interface findMainFilmInfo extends RowDataPacket {
  genre_name: string;
  original_title: string;
  release_date: string;
  complete_name: string;
  company: string; // Nombre de la productora
  duration: string;
  overview: string;
}


