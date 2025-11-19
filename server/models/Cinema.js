import mongoose from "mongoose";

const areaEnum = [
  "Urban",
  "Nothern",
  "Eastern",
  "Thonburi",
  "Pathumthani",
  "Nonthaburi"
];

const locationEnum = [
  "Bangkok",
  "Central",
  "North",
  "South",
  "East"
];

const cinemaSchema = new mongoose.Schema({
  cinemaID: { type: Number, required: true, unique: true },
  cinemaImage: { type: String, default: null },
  cinemaName: { type: String, required: true },
  Location: { type: String, required: true, enum: locationEnum },
  Area: { type: String, default: null, enum: areaEnum },
  cinemaInformation: { type: String, default: null },
  address: { type: String, default: null },
  officeHours: { type: String, required: true, default: "9:00 AM - 12:00 PM" },
  Transport: { type: String, default: "BTS 'Siam' Station : Exit No. 5 / MRT 'Samyarn' Station : Exit No. 1, 2 / Bus : 34, 59, 107, 129, 503, 63, 24, 178, 79" },
  map: { type: String, default: null }
}, { timestamps: true });

// Auto-increment cinemaID
cinemaSchema.pre('save', async function (next) {
  if (this.isNew && (this.cinemaID === undefined || this.cinemaID === null)) {
    const last = await this.constructor.findOne({}, {}, { sort: { cinemaID: -1 } });
    this.cinemaID = last ? last.cinemaID + 1 : 1;
  }
  next();
});

const Cinema = mongoose.model('Cinema', cinemaSchema);
export default Cinema;