const Orders=require("../Models/Orders");
const Products=require("../Models/Products");
const mongoose=require('mongoose');


exports.getAllOrders=(req,res,next)=>{
    Orders.find()
    .select("product quantity _id")
    .populate('product','name price _id')
    .exec()
    .then((response)=>{
        res.status(200).json({
            count:response.length,
            orders:response.map((res)=>{
                return{
                    _id:res._id,
                    product:res.product,
                    quantity:res.quantity,
                    request:{
                        type:'GET',
                        url:"http://localhost:3000/orders/"+res._id
                    }
                }
            })
        });
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
   
}


exports.addOrder=(req,res,next)=>{
    Products.findById(req.body.productId)
    .then((product)=>{
        if(!product){
            return res.status(404).json({
                "message":"Product with corresponding id doesnt exists",
                request:{
                    type:'GET',
                    desscription:"GET_ALL_PRODUCTS",
                    url:"http://localhost:3000/products"
                }
            });
        }
        const Order=new Orders({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productId
        });
        return Order.save()
    })
    .then((result)=>{
        res.status(201).json({
            message:'Order created',
            createdOrder:{
                _id:result._id,
                quantity:result.quantity,
                product:result.product
            },
            request:{
                type:'GET',
                url:"http://localhost:3000/orders/"+result._id
            }
        });
    })
    .catch((error)=>{
        res.status(500).json({
            error:error
        })
    });
}



exports.getparticularOrder=(req,res,next)=>{
    const id=req.params.orderId;
    Orders.findById(id)
    .populate('product','name price _id')
    .exec()
    .then((response)=>{
        if(response){
            res.status(200).json({
                order:response,
                request:{
                    type:'GET',
                    desscription:"GET_ALL_ORDERS",
                    url:"http://localhost:3000/orders"
                }

            });
        }else{
            res.status(404).json({
                "message":"Orders with corresponding id doesnt exists",
                request:{
                    type:'GET',
                    desscription:"GET_ALL_ORDERS",
                    url:"http://localhost:3000/orders"
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


exports.updateOrders=(req,res,next)=>{
    const id=req.params.productId;
    res.status(200).json({
        message:'Handling the patch request for the /orders/orderId',
        id:id
    })
}

exports.deleteOrder=(req,res,next)=>{
    const id=req.params.orderId;
    Orders.findOneAndRemove({_id:id})
    .exec()
    .then((response)=>{
        res.status(200).json({
            message:"order_deleted",
            response:response
        });
    })
    .catch((err)=>{
        res.status(500).json(err);
    }) 
}