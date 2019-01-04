const fs = require('fs');
const path = require("path");
const rootPath = require('../util/path');
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
       
    }

    static edit(productId, product, cbFunc) {
        
    }

    static delete(productId, cbFunc) {
        
    }

    static getAll(cbFunc) {
        
    }

    static getProductById(id, cbFunc) {
    
    }
}