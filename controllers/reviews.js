const Listing=require("../Models/listing");
const Review=require("../Models/review");

// Create Reviews
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    // console.log(newReview);
    
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("new review saved");
  req.flash("success", "Review Created");
 res.redirect(`/listings/${listing._id}`);
  }


// delete review Route
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error", "Review Deleted");
    res.redirect(`/listings/${id}`)
    }