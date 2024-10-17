const express = require ('express');
const router=express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js")
const Listing = require('../Models/listing');
const Review = require("../Models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")
const reviewControllers=require("../controllers/reviews.js")

 
 // Reviews 
  // Create Reviews
  router.post("/",isLoggedIn, validateReview, wrapAsync(reviewControllers.createReview));
 
// delete review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync (reviewControllers.destroyReview))


module.exports=router;