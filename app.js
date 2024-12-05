const express = require('express');
const app = express();

app.listen(3000, (req, res) => {
    console.log("server is listening to port 3000");


})

const path = require('path');
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))

const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main()
    .then((res) => {
        console.log("Connection is Working");
    })
    .catch((err) => {
        console.log(err);
    })

const Listing = require("./models/listing.js");
const { log } = require('console');
const { monitorEventLoopDelay } = require('perf_hooks');

// ----------------------------------------------------------------------------------

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    // .then((res)=>{
    //     console.log(res);
    // })
    // .catch((err)=>{
    //     console.log("Error Occured:",err);

    // })

    res.render("listings/index.ejs", { allListings })
});


// New Route

app.get("/listings/new", (req, res) => {

    res.render("listings/new.ejs")
})


// Create Listing

app.post("/listings", (req, res) => {
    let listing = req.body.listing;

    let newListing = new Listing(listing)

    console.log(newListing);
    


})


// Read or Show Route

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let indData = await Listing.findById(id);


    // res.send("working");
    res.render("listings/show.ejs", { indData })
})



// app.get("/testListing",async (req,res)=>{

//     let sampleListing = new Listing({
//   


// -------------------------------------------------------------------------------------


app.get("/", (req, res) => {

    res.send("Root Directory")

})

