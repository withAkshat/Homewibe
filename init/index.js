const mongoose = require('mongoose');

async function  main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().catch((err)=>{
    console.log("Some Error Occured:",err);
    
});

const Listing = require("../models/listing.js");

const initData = require('./data.js');

async function creation(){
    await Listing.insertMany(initData.data)
}

// creation().then((res)=>{
//     console.log("Data Inserted");
    
// }).catch((err)=>{
//     console.log("error" ,err)
    
// })