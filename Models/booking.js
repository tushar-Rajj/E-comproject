const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  people: {
    type: Number,
    required: true
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  canceled: {
    type: Boolean,
    default: false
},
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
