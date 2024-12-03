const mongoose = require('mongoose');

let URL ="mongodb://127.0.0.1:27017/wanderlust"

async function main(){
    await mongoose.connect(URL)
}

main().catch((err)=>{
    console.log(err);
    
})

const Schema = mongoose.Schema;



const listingSchema = new Schema({
    title: {
        type :String,
        required:true,
    },
    description:{
        type: String,
        
    },
    image:{
        filename:{
            type:String, 
        },
        url: String,
        // default:"https://images.unsplash.com/photo-1733028724656-b456573528ee?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // set:(url)=> url=== ""? "https://images.unsplash.com/photo-1733028724656-b456573528ee?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        // :url,

    },
    price:Number,
    location:String,
    country:String,
})

const Listing = mongoose.model( "Listing" , listingSchema );
module.exports = Listing;
