const fs = require('fs');
const path = require("path");
const rootPath = require('../util/path');
const file = path.join(rootPath, "data", "cart.json");

module.exports = class Cart {
    static addProducts(id, productPrice) {
        fs.readFile(file, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) { cart = JSON.parse(fileContent) }
            const existingProductIndex = cart['products'].findIndex(product => product.id == id);
            const existingProduct = cart['products'][existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct['qty'] = updatedProduct['qty'] + 1;
                cart['products'][existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart['products'] = [...cart['products'], updatedProduct]
            }
            cart['totalPrice'] = cart['totalPrice'] + +productPrice;
            fs.writeFile(file, JSON.stringify(cart), (err) => {
                if (err !== null) console.log("Error in adding to cart :", err);
            })
        })
    }
}