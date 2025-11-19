import express from "express";
import {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion
} from "../controllers/PromotionController.js";

const router = express.Router();

router.post("/", createPromotion);
router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;
