const express = require('express');
const app = express();
const morgan=require("morgan");
const bodyParser=require("body-parser");
const productRoutes=require("./Api/Routes/Products");
const orderRoutes=require("./Api/Routes/Orders");
const userRoutes=require("./Api/Routes/Users");
const mongoose=require('mongoose');

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//settingup the Mongoclient connection for connecting to the database.
mongoose.connect("mongodb+srv://username:password@node-rest-shop-8c04h.mongodb.net/test?retryWrites=true")

//cors middleware before the request actaully process 
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


//declaring the routes.
app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/users",userRoutes);


//middleware for throwing 404 error when no routes matches
app.use(function(req,res,next){
    const error=new Error("Not found");
    error['status']=404;
    next(error);
});


//middleware for handling errors
app.use(function(error,req,res,next){
    res.status(error.status||500).json({
        error:error.message,
        code:error.status
    })
})

module.exports = app;