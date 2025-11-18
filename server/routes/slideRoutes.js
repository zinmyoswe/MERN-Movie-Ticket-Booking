import express from 'express';
import { createSlide, getSlides, getSlideById, updateSlide, deleteSlide } from '../controllers/slideController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: list and get
router.get('/', getSlides);
router.get('/:id', getSlideById);

// Admin protected: create, update, delete
router.post('/', protectAdmin, createSlide);
router.put('/:id', protectAdmin, updateSlide);
router.delete('/:id', protectAdmin, deleteSlide);

export default router;
