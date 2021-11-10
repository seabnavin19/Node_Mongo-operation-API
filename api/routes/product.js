const express= require("express");
const Product= require("../models/product");
const mongoose= require("mongoose");
const multer= require("multer")


const router= express.Router()

//define the upl;oad file
const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads')
    },
    filename:function(req,file,cb){
        cb(null, file.originalname);
    }
})
const fileFilter= (req,file,cb)=>{
    if(file.mimetype==="image/png"){
        cb(null,true)
    }else{
        cb(null,false)
    }

}

const upload= multer({
    storage:storage,
    fileFilter:fileFilter
})


router.get("/",(req,res,next)=>{
  const product= Product.find()
  .select("name price _id productImage")
  .exec()
  .then(docs=>{
      const response= {
          count: docs.length,
          products:docs.map(doc=>{
              return{
                  name:doc.name,
                  price:doc.price,
                  _id:doc._id,
                  productImage:doc.productImage,
                  request:{
                      type:"GET",
                      url:""
                  }
              }
          })
      }
      res.status(200).json(response)
  })
  .catch(err=>{
      res.status(404).json({
          erorr: err
      })
  })
})

router.post("/",upload.single("productImage"),(req,res,next)=>{
   const product= new Product({
       _id: new mongoose.Types.ObjectId(),
       name:req.body.name,
       price: req.body.price,
       productImage:req.file.path

    })
    product
    .save()
    .then(result=>{
        console.log(result)

        res.status(201).json({
            message:"success post",
            Createdproducts: {
                name: result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:"GET",
                    url:""
                }
            }
        })
    }).catch(err=>
        res.status(500).json({
            erorr:"not update"
        })
        );
    // console.log(erorr);
    

})

router.get("/:productId",(req,res,next)=>{
   const  product= Product.findById(req.params.productId)
   .select("name price _id")
    .exec()
    .then(doc =>{
        console.log(doc);
        

        if(doc){
            res.status(200).json({
                product:doc,
                request:{
                    type:"GET"
                }
            })
        }
        else{
            res.status(404).json({err:" not found"})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({erorr:err})
    });

})

router.delete("/:productId",(req,res,next)=>{
   const id= req.params.productId;
   Product.remove({_id:id})
   .exec()
   .then(result=>{
       res.status(200).json({
           message:"product deleted",
           request:{
               id:id
           }
       })
   })
   .catch(err=>{
       res.status(500).json({
           erorr: err
       })
   })

})

router.patch("/:productId",(req,res,next)=>{
    const id = req.params.productId;
    const updateOps={};
    for(const op of req.body){

        updateOps[op.propName]=op.value;
        
    }
    // console.log(u);
    Product.update({_id:id},{$set:updateOps})
    .exec()
    .then(res=>{
        res.status(200).json(res)
    })
    .catch(err=>{
        res.status(404).json(err)
    });

})




module.exports= router;