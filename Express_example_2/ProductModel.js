const fs = require("fs");
const path  = require("path");
const mainPath =  require("./path");
const filePath = path.join(mainPath,"data/products.json")

module.exports  = class ProductModel{

    static fetchProducts(){
        return new Promise(function(resolve,reject){
            fs.readFile(filePath,function(err,filecontent){
                if(err){
                    reject()
                }
                const products = JSON.parse(filecontent);
                resolve(products);
            })

        })
    }
}