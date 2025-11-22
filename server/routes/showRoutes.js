import express from "express";
import { addShow, deleteShow, getNowPlayingMovies, getShow, getShowById, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add',protectAdmin ,addShow)
showRouter.get('/all',getShows)
showRouter.get('/single/:showId', getShowById) // New route
showRouter.get('/:movieId', getShow)
showRouter.post("/delete-show", protectAdmin, deleteShow);



export default showRouter;