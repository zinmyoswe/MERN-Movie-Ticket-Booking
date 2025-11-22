import express from "express";
import { addShow, deleteShow, getNowPlayingMovies, getShow, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies)
showRouter.post('/add',protectAdmin ,addShow)
showRouter.get('/all',getShows)
showRouter.get('/:movieId', getShow)
showRouter.post("/delete-show", protectAdmin, deleteShow);



export default showRouter;