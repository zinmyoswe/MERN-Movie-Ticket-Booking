import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'Movie'},
    show: {type: String, required: true, ref: 'Show'},
    cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, default: false},
    paymentLink: {type: String},
}, {timestamps: true}
)

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking;