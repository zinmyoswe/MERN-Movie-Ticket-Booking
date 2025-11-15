import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { getAllBookings, getAllShows, getDashboardData, isAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();


adminRouter.post('/is-admin',protectAdmin ,isAdmin)
adminRouter.post('/dashboard',protectAdmin ,getDashboardData)
adminRouter.post('/all-shows',protectAdmin ,getAllShows)
adminRouter.post('/all-bookings',protectAdmin ,getAllBookings)


export default adminRouter;