const Products=require("../Models/Products");
const mongoose=require("mongoose");

exports.getAllProducts=(req,res,next)=>{
    Products.find()
    .select('name price _id')
    .exec()
    .then((produsts)=>{
        const response={
            count:produsts.length,
            products:produsts.map((product)=>{
                return{
                    name:product.name,
                    price:product.price,
                    _id:product._id,
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/products/"+product._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch((error)=>{
        res.status(500).json({
            message:error
        });
    })    
}


exports.addProducts=(req,res,next)=>{
    const product=new Products({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    })
    product.save()
    .then((createdProduct)=>{
        res.status(201).json({
            "message":"Created product succesfully",
            createdProduct:{
                name:createdProduct.name,
                price:createdProduct.price,
                _id:createdProduct._id,
                request:{
                    type:'GET',
                    url:"http://localhost:3000/products/"+createdProduct._id
                }
            }
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })   
}


exports.getParticularProduct=(req,res,next)=>{
    const id=req.params.productId;
    Products.findById(id)
    .select("name price _id")
    .exec()
    .then((response)=>{
        if(response){
            res.status(200).json({
                product:response,
                request:{
                    type:'GET',
                    desscription:"GET_ALL_PRODUCTS",
                    url:"http://localhost:3000/products"
                }

            });
        }else{
            res.status(404).json({
                "message":"Product with corresponding id doesnt exists",
                request:{
                    type:'GET',
                    desscription:"GET_ALL_PRODUCTS",
                    url:"http://localhost:3000/products"
                }
            });
        }
    })
    .catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
}


exports.updateProduct=(req,res,next)=>{
    const id=req.params.productId;
    Products.update({_id:id},{
        $set:{
            name:req.body.newname,
            price:req.body.newprice

        }
    }).exec()
    .then((response)=>{
        res.status(200).json({
            message:"Product updated",
            request:{
                type:'GET',
                url:"http://localhost:3000/products/"+id
            }
        });
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}


exports.deleteProduct=(req,res,next)=>{
    const id=req.params.productId;
    Products.findOneAndRemove({_id:id})
    .select("name price _id")
    .exec()
    .then((response)=>{
        res.status(200).json({
            message:"product_deleted",
            response:response
        });
    })
    .catch((err)=>{
        res.status(500).json(err);
    }) 
}