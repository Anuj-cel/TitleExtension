const express=require('express');
const app=express();
const Profile=require("./models/Profiles");
const {dbConnect}=require('./db');
const {sequelize}=require('./db');
const cors = require("cors");

dbConnect();
app.use(cors());

app.use(express.json())
app.post("/",async(req,res)=>{
try{
    console.log("This is reqbody",req.body);
    const profile=await Profile.create(req.body);
    res.json({status:"success",data:profile});
}catch(err)
{
    console.error("Error creating profile:",err);
    res.status(500).json({status:"error",message:"Internal Server Error"});
}
})

app.listen(5000,()=>{
    console.log("server is listening on port 5000");
})