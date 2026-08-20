import mongoose, { connect } from "mongoose";
 const connetDB=async () => {
   try{
    const conn=await mongoose.connect('mongodb://localhost:27017/Expense');
    console.log("connected to:", conn.connection.host )
   }
   catch(error){
    console.log("Something wrong with connection",error)
   }
 }
 export default connetDB;
 