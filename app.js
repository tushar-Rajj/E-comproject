if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}

console.log(process.env.secret);


const express = require ('express');
const app=express();
const mongoose=require('mongoose');
const path =require("path");
const methodOverride = require ("method-override");
const ejsMate=require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js")
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");
const flash=require("connect-flash")
const session=require("express-session");
const user = require('./Models/user.js');
const userRouter = require("./routes/user.js")
const bookingRouter = require("./routes/booking");
const ownerRoutes = require('./routes/ownerRoutes'); 
// const bookingRouter = require("./routes/booking.js"); // Adjust path as needed

async  function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ProjectData');
}


main()
.then(()=>{
    console.log("Connected to Data Base");
}).catch((err)=>{console.error(err)});


app.set("view engine","ejs")
app.set("views",path.join( __dirname,"views"));
app.use(express.static(path.join( __dirname,"/public")));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));


const sessionOption = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/",(req,res)=>{
  res.redirect("/listings")
})


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // res.locals.success = req.user;
  res.locals.error = req.flash("error"); // You might want to handle error messages as well
  res.locals.currUser=req.user || null;
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeuser=new User({
//     email:"student@gail.com",
//     username:"delta-user"
//   })
//   let registeruser= await User.register(fakeuser,"helloworld");
//   res.send(registeruser)
// })


// // app.get("/testListing",async(req,res)=>{
// //     let sampleTest=new Listing({
// //         title:"My new Villa",
// //         description:"By the beach",
// //         price:1200,
// //         location:"Goa",
// //         country:"India",
// //     })

// //     await sampleTest.save();
// //     console.log("Data Was saved");
// //     res.send("Successful test")
// // })

// app.get("/listings", async (req,res)=>{
//   const allListing= await Listing.find({});
//   res.render("listing/index.ejs",{allListing});
// });

// app.get("/listings/new", async(req,res)=>{
//     // let {id}=req.params;
//     // const listing=await Listing.findById(id) 
//     res.render("listing/new.ejs")  
// })




// app.get("/listings/:id", async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id) 
//     res.render("listing/show.ejs",{listing})  
// })

// app.post("/listings", async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//   });










app.use("/listings",listingsRouter);
  // Reviews 
  // Post Reviews
app.use("/listings/:id/reviews",reviewsRouter);

// User 
app.use("/",userRouter);

app.use("/owner", listingsRouter); // Owner's listings routes
app.use(ownerRoutes);
// Book
app.use(bookingRouter);

// Use the route for owner bookings
// app.use(bookingRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"PAGE NOT FOUND"))
})

app.use((err,req,res,next)=>{
  let{statusCode=500,message="SOMETHING WENT WRONG !! "}=err;
  res.status(statusCode).render("listing/error.ejs",{message});

})
 


app.listen(8000,()=>{
    console.log("Server start at port 8000");
});

