const express = require("express");
const router = express.Router();
const Booking = require("../Models/booking.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn } = require("../middleware");

router.get('/listings/:id/book', async (req, res) => {
  const { id } = req.params;

  try {
      const listing = await Listing.findById(id); // Fetch the listing from the database
      if (!listing) {
          req.flash('error', 'Listing not found');
          return res.redirect('/listings');
      }
      res.render('listing/book', { listing }); // Pass the listing to the template
  } catch (e) {
      req.flash('error', 'Something went wrong');
      res.redirect('/listings');
  }
});





router.get('/bookings/:id/confirmation', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id).populate('listing');
  if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
  }
  res.render('booking/confirmation', { booking });
});


router.post("/listings/:id/book", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { checkInDate, checkOutDate, people } = req.body.booking;

  const listing = await Listing.findById(id);
  if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
  }

  // Calculate the number of days
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const numberOfNights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

  // Calculate the total price
  const totalPrice = numberOfNights * listing.price * people;

  const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      people
  });

  await booking.save();

  req.flash("success", "Your booking is confirmed!");
  res.redirect("/listings"); 
});

router.get("/bookings", isLoggedIn, async (req, res) => {
  try {
      const bookings = await Booking.find({ user: req.user._id }).populate("listing"); // Populate the listing data
      res.render("listing/userBookings", { bookings });
  } catch (err) {
      req.flash("error", "Could not retrieve your bookings.");
      res.redirect("/listings");
  }
});


// Cancel booking route
router.delete('/bookings/:bookingId', isLoggedIn, async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
      req.flash('error', 'Booking not found.');
      return res.redirect('/listings');
  }

  if (!booking.user.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to cancel this booking.');
      return res.redirect('/listings');
  }

  await Booking.findByIdAndDelete(bookingId);
  req.flash('error', 'Booking successfully canceled.');
  res.redirect('/listings');
});

module.exports = router;
