
// Home Route
const Listing=require("../Models/listing.js")


module.exports.index=async (req, res) => {
  const { category } = req.query;
  let filter = {};

  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);

  res.render("listing/index", { allListings, category });

    // const allListings = await Listing.find({});
    // res.render("listing/index.ejs", { allListings });
  };

//New Route
  module.exports.renderNewForm= (req, res) => {
    console.log(req.user);
      res.render("listing/new.ejs");
    }

 
  //Show Route
module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author",
    }}).populate("owner");
    if(!listing){
      req.flash("error", "Listing You requested for does not  exist");
      res.redirect("/listings");
    }
    console.log(listing.owner);
    
    res.render("listing/show.ejs", { listing });
  }

  //Create Route
module.exports.createListing=async (req, res) => {
  let url= req.file.path;
  let filename=req.file.filename;
  // console.log(url,"",filename);
  
    const newListing = new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};
    await newListing.save();
     req.flash("success", "Listing Is Created");
     res.redirect("/listings");
      
   }

    //Edit Route
module.exports.renderEditForm=async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing You requested for does not  exist");
      res.redirect("/listings");
    }

    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_80,w_80")
    
    res.render("listing/edit.ejs",{listing,originalImageUrl})
  }

  // Update router 
module.exports.updateListing=async (req,res)=>{
    
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if (! listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You don't have permission to edit");
      return res.redirect(`/listings/${id}`);
    }
   
    let listingg= await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file!=="undefined"){
    let url= req.file.path;
    let filename=req.file.filename;
    listingg.image={url,filename}
    await listingg.save();
    }
    req.flash("success", "Listing Updated");
   res.redirect("/listings/"+id)
  }

 //Delte router
 module.exports.destroyListing=async (req,res)=>{
    let { id } = req.params;
    let deletelisthing = await Listing.findByIdAndDelete(id)
    req.flash("error", "Listing Is Deleted");
    console.log(deletelisthing);
   res.redirect("/listings")
  }

