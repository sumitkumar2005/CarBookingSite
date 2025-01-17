import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

function connect(){
    mongoose.connect("mongodb://localhost:27017/CarBooking",{useNewUrlParser:true}).then(()=>console.log("connected to database"))
}


export default connect;