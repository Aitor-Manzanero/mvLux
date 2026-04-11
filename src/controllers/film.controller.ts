import { Request, Response } from "express";
import { findFilmsByName, findFilmsByDirector, findFilmInfoMainPannel } from "../services/film.service.js";

export async function getFilms(req: Request, res: Response) {
  try {
    const name = req.query.name as string;

    if (!name) {
      return res.status(400).json({ error: "Debes enviar ?name= en la URL" });
    }

    const films = await findFilmsByName(name);
        
    // @TODO: Adaptar JSON  a interfaz frontal
    res.json({
      count: films.length,
      results: films
    });
  } catch (error) {
    console.error("Error en getFilms:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// export async function getFilmsByDirector(req: Request, res: Response) {
//   try {
//     const name = req.query.name as string;

//     if (!name) {
//       return res.status(400).json({ error: "Debes enviar ?name= en la URL" });
//     }

//     const films = await findFilmsByDirector(name);

//     res.json({
//       count: films.length,
//       results: films
//     });
//   } catch (error) {
//     console.error("Error en getFilmsByDirector:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// }

export async function getFilmInfoMainPannel(req: Request, res: Response) {
  try {
    const name = req.query.name as string;

    if (!name) {
      return res.status(400).json({ error: "Debes enviar ?name= en la URL" });
    }

    const films = await findFilmInfoMainPannel(name);
        
    // @TODO: Adaptar JSON  a interfaz frontal
    res.json({
      count: films.length,
      results: films
    });
  } catch (error) {
    console.error("Error en getFilms:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

