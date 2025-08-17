import { Router } from "express";
import { getMovies } from "../controllers/movie.controller.js";

const router = Router();

router.route("/getAllMovies").get(getMovies);

export default router;