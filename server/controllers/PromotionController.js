import Promotion from "../models/Promotion.js";
import mongoose from "mongoose";

// Create promotion
export const createPromotion = async (req, res) => {
  try {
    const {
      PromotionImage,
      PromotionName,
      PromotionPhrase,
      Quota,
      PromotionDescription
    } = req.body;

    if (!PromotionImage || !PromotionName) {
      return res.status(400).json({
        success: false,
        message: "PromotionImage and PromotionName are required"
      });
    }

    const promotion = await Promotion.create({
      PromotionImage,
      PromotionName,
      PromotionPhrase,
      Quota,
      PromotionDescription
    });

    res.json({ success: true, promotion });
  } catch (error) {
    console.error("Create Promotion Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all
export const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json({ success: true, promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get by ID (MongoID or PromotionID)
export const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;

    let promotion = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      promotion = await Promotion.findById(id);
    }

    // Try PromotionID
    if (!promotion) {
      promotion = await Promotion.findOne({ PromotionID: id });
    }

    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    res.json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    let promotion = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      promotion = await Promotion.findById(id);
    }

    if (!promotion) {
      promotion = await Promotion.findOne({ PromotionID: id });
    }

    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    Object.assign(promotion, req.body);
    await promotion.save();

    res.json({ success: true, promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    let promotion = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      promotion = await Promotion.findById(id);
    }

    if (!promotion) {
      promotion = await Promotion.findOne({ PromotionID: id });
    }

    if (!promotion) {
      return res.status(404).json({ success: false, message: "Promotion not found" });
    }

    await promotion.deleteOne();

    res.json({ success: true, message: "Promotion deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
