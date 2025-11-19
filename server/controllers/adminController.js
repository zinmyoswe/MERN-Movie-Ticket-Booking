import Show from "../models/Show.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";

//API to check if user is admin
export const isAdmin = async (req, res) => {
  res.json({success: true, isAdmin: true})
}

//API to get dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const bookings = await Booking.find({ isPaid: true });

    // Pagination for active shows (server-side)
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const perPage = Math.max(1, parseInt(req.query.perPage || '20'));
    const filter = { showDateTime: { $gte: new Date() } };

    const totalActiveShows = await Show.countDocuments(filter);
    const activeShows = await Show.find(filter)
      .populate('movie')
      .populate({ path: 'cinemas', select: 'cinemaName Location Area' })
      .sort({ showDateTime: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
      activeShows,
      totalUser,
      pagination: {
        page,
        perPage,
        totalActiveShows,
        totalPages: Math.ceil(totalActiveShows / perPage)
      }
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error(error);
    res.json({success: false, message: error.message})
  }
}

//API to get all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = (await Show.find({showDateTime: { $gte: new Date() }}).populate('movie')).toSorted()
    res.json({success: true, shows})
} catch (error) {
    console.error(error);
    res.json({success: false, message: error.message})
  }
}


// API to get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user').populate({
        path: "show",
        populate: {path: "movie"}
    }).sort({ createdAt: -1 })
    res.json({success:true, bookings})
  } catch (error) {
    console.error(error);
    res.json({success: false, message: error.message})
  }
}






