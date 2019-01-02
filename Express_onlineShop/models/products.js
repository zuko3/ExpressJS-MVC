const fs = require('fs');
const path = require("path");
const rootPath = require('../util/path');
const file = path.join(rootPath, "data", "products.json");
const Cart = require('./cart');

module.exports = class Products {
    constructor(title, imageUrl, description, price) {
        this.id = Math.random().toString();
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        fs.readFile(file, (err, fileContent) => {
            let products = [];
            if (!err) { products = JSON.parse(fileContent); }
            products.push(this);
            fs.writeFile(file, JSON.stringify(products), (err) => {
                if (null !== err) { console.log("Error occured in writing file :", err) }
            })
        });
    }

    static edit(productId, product, cbFunc) {
        fs.readFile(file, (err, fileContent) => {
            let products = [];
            if (err !== null) return cbFunc();
            products = JSON.parse(fileContent);
            const existingProductIndex = products.findIndex(product => product.id == productId);
            if (existingProductIndex !== -1) {
                products[existingProductIndex] = product;
                fs.writeFile(file, JSON.stringify(products), (err) => {
                    if (null !== err) { console.log("Error occured in writing file :", err) }
                    cbFunc()
                })
            } else {
                cbFunc()
            }
        });
    }

    static delete(productId, cbFunc) {
        fs.readFile(file, (err, fileContent) => {
            if (null !== err) return cbFunc();
            else {
                const existingProducts = JSON.parse(fileContent);
                const products = existingProducts.filter(product => product.id !== productId);
                
                let productPrice = 0;
                const foundProduct = existingProducts.find(product => product.id === productId);
                if (foundProduct) {
                    productPrice = foundProduct.price
                }else{
                    return cbFunc();
                }
                         
                fs.writeFile(file, JSON.stringify(products), (err) => {
                    if (null !== err) console.log(err);
                    Cart.deleteProduct(productId, productPrice, cbFunc)
                });
            }
        });
    }

    static getAll(cbFunc) {
        fs.readFile(file, (err, fileContent) => {
            if (null !== err) cbFunc([]);
            cbFunc(JSON.parse(fileContent));
        });
    }

    static getProductById(id, cbFunc) {
        fs.readFile(file, (err, fileContent) => {
            if (null !== err) cbFunc(null);
            const product = JSON.parse(fileContent).find(product => product.id == id);
            cbFunc(product);
        })
    }
}