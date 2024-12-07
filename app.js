const express = require('express');
const app = express();

app.listen(3000, (req, res) => {
    console.log("server is listening to port 3000");


})

const ejsMate = require("ejs-mate")
const path = require('path');
app.set("view engine", "ejs")
app.engine("ejs",ejsMate)

app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({ extended: true }))


// --------------------------------------------------------------------------------------

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


// ----------------------------------------------------------------------------------

let methodOverride = require('method-override')
app.use(methodOverride('_method'))

// ------------------------------------------------------------------------------------

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


// Edit Route

app.get("/listings/:id/edit", async(req,res)=>{
    let { id } = req.params;

    let listingData = await Listing.findById(id);
//   console.log(listingData);
    
     res.render("listings/edit.ejs", { listingData });
})


//  Update Route

app.put("/listings/:id", async (req,res)=>{

    let { id } = req.params;
    // console.log({...req.body.listing });
    
    let upData = await Listing.findByIdAndUpdate( id ,{...req.body.listing });
    console.log(upData);
    
    res.redirect(`/listings/${id}`)
    
})


app.delete("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    let delData = await Listing.findByIdAndDelete(id);
    console.log(delData);
    
    res.redirect("/listings")
})
// -------------------------------------------------------------------------------------


app.get("/", (req, res) => {

    res.send("Root Directory")

})

