const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");
const { object } = require("joi");

const MONGO_URL = "mongodb://127.0.0.1:27017/ProjectData";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

 // Ensure the path is correct

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"66c79483308793b873ea475f",}))
  await Listing.insertMany(initData.data); // Use initData directly if it's an array of data
  console.log("data was initialized");

};

initDB();