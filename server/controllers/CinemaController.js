import Cinema from "../models/Cinema.js";

// Create a cinema (admin only)
export const createCinema = async (req, res) => {
  try {
    const {
      cinemaImage,
      cinemaName,
      Location,
      Area,
      cinemaInformation,
      address,
      officeHours,
      Transport,
      map
    } = req.body;

    if (!cinemaName || !Location) return res.json({ success: false, message: "cinemaName and Location are required" });

    // Area only for Bangkok
    const areaValue = Location === "Bangkok" ? Area || null : null;

    // Ensure defaults when front-end sends empty strings
    const officeDefault = officeHours && officeHours.trim() ? officeHours : "9:00 AM - 12:00 PM";
    const transportDefault = Transport && Transport.trim() ? Transport : "BTS 'Siam' Station : Exit No. 5 / MRT 'Samyarn' Station : Exit No. 1, 2 / Bus : 34, 59, 107, 129, 503, 63, 24, 178, 79";

    // Explicitly assign next cinemaID to avoid relying on pre-save timing
    const last = await Cinema.findOne({}, {}, { sort: { cinemaID: -1 } });
    const nextCinemaID = last ? last.cinemaID + 1 : 1;

    const cinema = await Cinema.create({
      cinemaID: nextCinemaID,
      cinemaImage,
      cinemaName,
      Location,
      Area: areaValue,
      cinemaInformation,
      address,
      officeHours: officeDefault,
      Transport: transportDefault,
      map
    });
    res.json({ success: true, cinema });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all cinemas (optionally filter by location)
export const getCinemas = async (req, res) => {
  try {
    const { location } = req.query;
    const filter = location ? { Location: location } : {};
    const cinemas = await Cinema.find(filter).sort({ Location: 1, Area: 1, cinemaName: 1 });
    res.json({ success: true, cinemas });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Get single cinema by id (Mongo _id or cinemaID)
export const getCinemaById = async (req, res) => {
  try {
    const { id } = req.params;
    let cinema = await Cinema.findById(id);
    if (!cinema) {
      cinema = await Cinema.findOne({ cinemaID: Number(id) });
    }
    if (!cinema) return res.json({ success: false, message: "Cinema not found" });
    res.json({ success: true, cinema });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Update cinema (admin only)
export const updateCinema = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let cinema = await Cinema.findById(id);
    if (!cinema) {
      cinema = await Cinema.findOne({ cinemaID: Number(id) });
    }
    if (!cinema) return res.json({ success: false, message: "Cinema not found" });

    // Area only for Bangkok
    if (updates.Location && updates.Location !== "Bangkok") {
      updates.Area = null;
    }

    // Apply defaults if client sends empty strings
    if (updates.officeHours !== undefined) {
      updates.officeHours = updates.officeHours && String(updates.officeHours).trim() ? updates.officeHours : "9:00 AM - 12:00 PM";
    }
    if (updates.Transport !== undefined) {
      updates.Transport = updates.Transport && String(updates.Transport).trim() ? updates.Transport : "BTS 'Siam' Station : Exit No. 5 / MRT 'Samyarn' Station : Exit No. 1, 2 / Bus : 34, 59, 107, 129, 503, 63, 24, 178, 79";
    }

    Object.assign(cinema, updates);
    await cinema.save();
    res.json({ success: true, cinema });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete cinema (admin only)
export const deleteCinema = async (req, res) => {
  try {
    const { id } = req.params;
    let cinema = await Cinema.findById(id);
    if (!cinema) {
      cinema = await Cinema.findOne({ cinemaID: Number(id) });
    }
    if (!cinema) return res.json({ success: false, message: "Cinema not found" });
    await cinema.deleteOne();
    res.json({ success: true, message: "Cinema deleted" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export default {
  createCinema,
  getCinemas,
  getCinemaById,
  updateCinema,
  deleteCinema
};