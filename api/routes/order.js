const express= require("express")
const mongoose= require("mongoose");
const Order = require("../models/order");



const router= express.Router()

router.get("/",(req,res,next)=>{
    Order.find()
    .select("product quantity _id")
    .populate("product","name")
    .exec()
    .then(docs=>{
        res.status(200).json({
            count:docs.length,
            orders: docs.map(doc=>{
                return{
                    product: doc.product,
                    quantity: doc.quantity,
                    _id: doc._id
                }

            })
        })
    })

})

router.post("/",(req,res,next)=>{

    const order= new Order({
        _id:new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });
    
    order.save()
    .then(result=>{
       res.status(200).json({
           message:"success created",
           CreatedOrder:{
               _id:result._id,
               product:result.product,
               quantity:result.quantity,
           }
       })

    })
    .catch(err=>{
        res.status(500).json({
            erorr:err
        })
    })

})

router.get("/:orderId",(req,res,next)=>{
    const id = req.params.orderId;
    Order.find({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"sueeess",
            Order:result
        })
    })
    .catch(err=>{
        res.status(404).json({
            erorr:err
        })
    })
})

router.delete("/:productId",(req,res,next)=>{
    if( req.params.productId=="p12"){
        res.status(200).json({
            message:"delete 12"
        })
    }
    else{
        res.status(200).json({
            message:"wrong"
        })
    }

})




module.exports= router;