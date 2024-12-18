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

const { listingSchema } = require("./schema.js");
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


const validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
    
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");   
        throw new ExpressError(400 ,errMsg)
    }else{
        next();
    }
}


// New Route

app.get("/listings/new", (req, res) => {

    res.render("listings/new.ejs")
})


// Create Listing

app.post("/listings", validateListing, wrapAsync(async (req,res,next) => {
    let listing = req.body.listing;
    let newListing = new Listing(listing);

    await newListing.save();
    
    res.redirect("/listings") 
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data for listing")
    //  }


    
    //     let newListing =  new Listing(listing)

    //     if (!newListing.title){
    //         throw new ExpressError(400,"Title is missing")
    //     }

        
    //     if (!newListing.description){
    //         throw new ExpressError(400,"Description is missing")
    //     }

    //     if (!newListing.price){
    //         throw new ExpressError(400,"Price is missing")
    //     }

    //     if (!newListing.location){
    //         throw new ExpressError(400,"Location is missing")
    //     }
        // console.log(newListing);

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

app.put("/listings/:id", validateListing , wrapAsync( async (req,res)=>{

    let { id } = req.params;
    // console.log({...req.body.listing });
    
    let upData = await Listing.findByIdAndUpdate( id ,{...req.body.listing });
   
    
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
    next(new ExpressError(404,"Page Not found"));
})

// Error Handling Path...!!

app.use((err,req,res,next)=>{
    let { status=500 , message="Something went wrong" }= err;
    res.status(status).render("error.ejs" , { message })
    
    next();
})


// Root Path
app.get("/", (req, res) => {

    res.send("Root Directory")

})

