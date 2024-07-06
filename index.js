import express from "express";
import cors from "cors";


const app = express();
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).send({
        success:true,
        message:"Request fetched successfully"
    })
})

app.listen(3001,()=>{
    console.log("server is running on 3001");
})