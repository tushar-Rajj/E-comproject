const Listing=require("./Models/listing.js")
const Review=require("./Models/review.js")
const ExpressError =require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js");
const { reviewSchema} = require("./schema.js");
const review = require("./Models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL in session
        req.flash("error", "You must be logged in.");
        return res.redirect("/login");  // Redirect to login
    }
    next(); // If the user is authenticated, proceed to the next middleware/route handler
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make it available for the login route
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(req.params.id);
    // let listing= await Listing.findById(id);
    
    if (!req.isAuthenticated() || req.user.role !== 'owner') {
        req.flash('error', 'You must be an owner to access this page.');
        return res.redirect('/login');
    }
    next();
    
    if (req.user && req.user.role === 'owner') {
        return next();
    }
    req.flash('error', 'You do not have permission to access this page');
    // res.redirect('/listings');

    if (! listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        res.redirect(`/listings/${listing._id}`);
      }
      next();
}
module.exports.validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
     
     if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
     }
    else{
    next();
  }};

module.exports.validateReview=(req,res,next)=>{
    let {error}= reviewSchema.validate(req.body);
     
     if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
     }
    else{
    next();
  }};


module.exports.isReviewAuthor= async(req,res,next)=>{
    let { id, reviewId } = req.params;
    let review= await Review.findById(reviewId);
    if (! review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
      }
      next();
}

// module.exports.isOwner = (req, res, next) => {
//     if (req.user && req.user.role === 'owner') {
//         return next();
//     }
//     req.flash('error', 'You do not have permission to access this page');
//     res.redirect('/listings');
// };
