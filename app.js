const express= require("express");
const app= express()
const morgan = require("morgan")
const bodyParser= require("body-parser")
const mongoose= require("mongoose");

const ProductRouts= require("./api/routes/product");
const OrderRouter= require("./api/routes/order");
const userRoute= require("./api/routes/user");

mongoose.connect("mongodb+srv://Navin_Seab:"+ 
process.env.MONGO_ATLAS_PW
+"@cluster0.wvfd6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
)

app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())



//this is use for route
app.use("/products",ProductRouts);
app.use("/orders",OrderRouter);
app.use("/user",userRoute);

app.use((req,res,next)=>{
    const erorr= new Error("not found")
    erorr.status(404)
    next(erorr)
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        erorr:{
            message:err.message
        }
    })
})


// allow cors
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","*");

    if(req.method=="OPTIONS"){
        res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE")

        return res.status(200).json({})
    }
})
module.exports=app;
