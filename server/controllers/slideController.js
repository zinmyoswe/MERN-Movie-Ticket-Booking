import Slide from "../models/Slide.js";

// Create a slide (admin only)
export const createSlide = async (req, res) => {
  try {
    const { slideID, slideImage, slide_title, slidebutton, movieDetails, movieTrailers } = req.body;
    if (!slideID || !slideImage) return res.json({ success: false, message: 'slideID and slideImage are required' });

    const existing = await Slide.findOne({ slideID });
    if (existing) return res.json({ success: false, message: 'slideID already exists' });

    const slide = await Slide.create({ slideID, slideImage, slide_title, slidebutton, movieDetails, movieTrailers });
    res.json({ success: true, slide });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// Get all slides (public)
export const getSlides = async (req, res) => {
  try {
    const slides = await Slide.find({}).sort({ createdAt: -1 });
    res.json({ success: true, slides });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// Get single slide by id (id = Mongo _id or slideID)
export const getSlideById = async (req, res) => {
  try {
    const { id } = req.params;
    let slide = null;
    // try by Mongo _id first
    slide = await Slide.findById(id);
    if (!slide) {
      // try by slideID
      slide = await Slide.findOne({ slideID: id });
    }
    if (!slide) return res.json({ success: false, message: 'Slide not found' });
    res.json({ success: true, slide });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// Update slide (admin only)
export const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let slide = await Slide.findById(id);
    if (!slide) {
      slide = await Slide.findOne({ slideID: id });
    }

    if (!slide) return res.json({ success: false, message: 'Slide not found' });

    Object.assign(slide, updates);
    await slide.save();

    res.json({ success: true, slide });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// Delete slide (admin only)
export const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    let slide = await Slide.findById(id);
    if (!slide) {
      slide = await Slide.findOne({ slideID: id });
    }
    if (!slide) return res.json({ success: false, message: 'Slide not found' });

    await slide.deleteOne();
    res.json({ success: true, message: 'Slide deleted' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

export default {
  createSlide,
  getSlides,
  getSlideById,
  updateSlide,
  deleteSlide
}
