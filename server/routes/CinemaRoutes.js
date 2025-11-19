import express from 'express';
import { createCinema, getCinemas, getCinemaById, updateCinema, deleteCinema } from '../controllers/CinemaController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: list and get
router.get('/', getCinemas);
router.get('/:id', getCinemaById);

// Admin protected: create, update, delete
router.post('/', protectAdmin, createCinema);
router.put('/:id', protectAdmin, updateCinema);
router.delete('/:id', protectAdmin, deleteCinema);

export default router;