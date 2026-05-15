import { RowDataPacket } from "mysql2/promise";

export interface Film extends RowDataPacket {
  id: number; //Creo que no lo estoy usando. Comprobar si sobra
  original_title: string;
}

export interface findFilmsByDirector extends RowDataPacket {
  original_title: string;
}

export interface findMainFilmInfo extends RowDataPacket {
  genre_name: string;
  original_title: string;
  release_date: string;
  complete_name: string;
  name: string; // Nombre de la productora
  duration: string;
  overview: string;
}


