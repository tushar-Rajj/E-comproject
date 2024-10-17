const express = require ('express');
const router=express.Router();
const wrapAsync =require("../utils/wrapAsync.js")
const ExpressError =require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js");
const Listing = require('../Models/listing');
const flash=require("connect-flash");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer=require("multer")
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing))
// .post((req,res)=>{res.send(req.file)});
  //New Route
  router.get("/new",isLoggedIn,listingController.renderNewForm);
  

// Filter listings by category
router.get("/filter", async (req, res) => {
  const { category } = req.query;
  const filteredListings = await Listing.find({ category });
  res.render("listing/index", { allListings: filteredListings });
});
// end filter




router
.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))

// Home Route
// router.get("/", wrapAsync(listingController.index));
  

  //Show Route
// router.get("/:id", wrapAsync(listingController.showListing));
  
  //Create Route
// router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));

  //Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))


  // Update router
// router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing))

  //Delte router
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))


  module.exports=router;