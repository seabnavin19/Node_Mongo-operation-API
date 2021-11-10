const express= require("express");
const mongoose= require("mongoose");
const User= require("../models/user")
const router= express.Router()

const bcrypt= require("bcrypt")

router.post("/signup",(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{

        if(user.length>0){
            res.status(409).json({
                message:"User exist"
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    console.log("erorr in");
                    res.status(500).json({
                        erorr:err
                    })
                }
                else{
                    const user= new User({
                        _id:new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
        
                    user.save()
                    .then(result=>{
                        res.status(201).json({
                            message:"success"
                           
                        })
                    })
                    .catch(err=>{
                        console.log("erorr in");
                        res.status(200).json({
                            message:err
                        })
                    })
                }
            })
        }
    })
    
})


router.delete("/:userId",(req,res,next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"user deleted"
        })
    })
    .catch(er=>{
        res.status(201).json({
            erorr:err
        })
    })
})
module.exports= router;