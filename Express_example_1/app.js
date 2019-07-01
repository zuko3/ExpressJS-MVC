const express = require("express");
const bodyPareser= require("body-parser");
const errorController = require("./controllers/error");
const productRoutes = require("./routes/product");
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyPareser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use(function(req,res,next){
    console.log("request url:",req.url);
    next();
});

app.use("/product",productRoutes);
app.use(errorController.get404Page);


app.listen(3000,function(){
    console.log("server started PORT:",3000);
});