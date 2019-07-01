const express = require("express");
const productRouter = require("./ProductRouter");
const path = require("path");
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname,'public')));

app.use(function(req,res,next){
    console.log("requested url is:",req.url);
    next();
});

app.use(productRouter);
app.use(function(req,res,next){
   res.send("<h1>Notfound</h1>")
})


app.listen(8000,function(){
    console.log("server listening at 8000..")
})