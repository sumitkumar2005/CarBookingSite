import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

function connect(){
    mongoose.connect(process.env.DB,{useNewUrlParser:true}).then(()=>console.log("connected to database"))
}


export default connect;