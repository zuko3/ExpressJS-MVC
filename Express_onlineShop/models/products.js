const fs = require('fs');
const path = require("path");
const rootPath = require('../util/path');
const file = path.join(rootPath, "data", "products.json");

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