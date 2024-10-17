const express = require('express');
const router = express.Router();
const Booking = require('../Models/booking'); // Adjust the path as needed
const Listing = require("../Models/listing"); // Adjust the path as needed
const { isOwner } = require("../middleware.js"); // Middleware to check if the user is an owner

// Middleware to ensure the user is an owner
// function isOwner(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === 'owner') {
//         return next();
//     }
//     req.flash('error', 'You must be logged in as an owner to access this page.');
//     res.redirect('/login');
// }

// Route to get bookings for the owner's listings
router.get('/owner/bookings', isOwner, async (req, res) => {
    try {
        // Find all listings owned by the current user
        const ownerListings = await Listing.find({ owner: req.user._id });

        // Extract listing IDs
        const listingIds = ownerListings.map(listing => listing._id);

        // Find all bookings where the listing ID is in the list of owner's listings
        const ownerBookings = await Booking.find({ listing: { $in: listingIds } }).populate('listing');

        // Render the owner bookings page with the fetched data
        res.render('booking/ownerBookings', { bookings: ownerBookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        req.flash('error', 'Could not load your bookings.');
        res.redirect('/listings');
    }
});

module.exports = router;
