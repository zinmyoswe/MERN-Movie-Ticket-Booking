import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  slideID: { type: String, required: true, unique: true },
  slideImage: { type: String, required: true },
  slide_title: { type: String, default: null },
  slidebutton: { type: String, default: null },
  movieDetails: { type: Object, default: null },
  movieTrailers: { type: Object, default: null }
}, { timestamps: true });

const Slide = mongoose.model('Slide', slideSchema);

export default Slide;
