import { Router } from "express";
import { getFilms,  getFilmInfoMainPannel} from "../controllers/film.controller.js";
//getFilmsByDirector
const router = Router();

router.get("/films", getFilms);
// router.get("/films/director", getFilmsByDirector);
router.get("/films/mainInfo", getFilmInfoMainPannel);


export default router;
