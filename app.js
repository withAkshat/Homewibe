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

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/errorHandling.js")

// -------------------------------------------------------------------------------------
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

app.post("/listings", wrapAsync(async (req,res,next) => {

    
    if(!req.body.listing){
        throw new ExpressError(400, "Bad request")
    }
    
        let listing = req.body.listing;
        let newListing =  new Listing(listing)
        // console.log(newListing);
        await newListing.save();
        
        res.redirect("/listings") 

}));


// Read or Show Route

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let indData = await Listing.findById(id);


    // res.send("working");
    res.render("listings/show.ejs", { indData })
}));


// Edit Route

app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let { id } = req.params;

    let listingData = await Listing.findById(id);
//   console.log(listingData);
    
     res.render("listings/edit.ejs", { listingData });
}));


//  Update Route

app.put("/listings/:id", wrapAsync( async (req,res)=>{

    let { id } = req.params;
    // console.log({...req.body.listing });
    
    let upData = await Listing.findByIdAndUpdate( id ,{...req.body.listing });
    console.log(upData);
    
    res.redirect(`/listings/${id}`)
    
}));


app.delete("/listings/:id", wrapAsync( async (req,res)=>{
    let { id } = req.params;
    let delData = await Listing.findByIdAndDelete(id);
    console.log(delData);
    
    res.redirect("/listings")
}));
// -------------------------------------------------------------------------------------


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page Not found"));
})

// Error Handling Path...!!

app.use((err,req,res,next)=>{
    let { status=500 ,message="Something went wrong" }= err;
    res.status(status).send(message);
    next();
})


// Root Path
app.get("/", (req, res) => {

    res.send("Root Directory")

})

