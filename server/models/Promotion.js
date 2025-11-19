import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    PromotionID: { type: Number, unique: true },
    PromotionImage: { type: String, required: true },
    PromotionName: { type: String, required: true },
    PromotionPhrase: { type: String, default: null },
    Quota: { type: String, default: null },
    PromotionDescription: { type: String, default: null }
  },
  { timestamps: true, versionKey: false }
);

// Auto-increment PromotionID
promotionSchema.pre("save", async function (next) {
  if (this.PromotionID) return next();

  const last = await mongoose
    .model("Promotion")
    .findOne()
    .sort("-PromotionID")
    .lean();

  this.PromotionID = last ? last.PromotionID + 1 : 1;
  next();
});

export default mongoose.model("Promotion", promotionSchema);
