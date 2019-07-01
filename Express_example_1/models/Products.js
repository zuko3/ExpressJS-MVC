const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid/v4');
const file = path.join(__dirname, "../data/products.json");

module.exports = class Products {
    constructor(name, price, url) {
        this.name = name;
        this.url = url;
        this.price = price;
    }

    static all() {
        console.log("Fetching all the products");
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (error, fileContents) {
                if (error !== null) {
                    console.log("error:", error);
                    reject();
                }
                const products = JSON.parse(fileContents);
                resolve(products)
            });
        });
    }

    static delete(id) {
        console.log("Delete product executed...");
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (error, fileContents) {
                if (error !== null) {
                    console.log("error:", error);
                    reject();
                }
                const products = JSON.parse(fileContents);
                const remainingProducts = products.filter(function (product) {
                    return product.id !== id
                });
                fs.writeFile(file, JSON.stringify(remainingProducts), function (error) {
                    if (error !== null) {
                        console.log("error occured", error);
                        reject();
                    }
                    resolve();
                })
            });
        });
    }

    static get(id) {
        console.log("get product executed...");
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (error, fileContents) {
                if (error !== null) {
                    console.log("error:", error);
                    reject();
                }
                const products = JSON.parse(fileContents);
                const product = products.find(function (product) {
                    return product.id === id
                });
                resolve(product);
            });
        });
    }

     static edit(id,product){
        console.log("edit product start ...");
        const {name,url,price} = product;
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (error, fileContents) {
                if (error !== null) {
                    console.log("error:", error);
                    reject();
                }
                const allProducts = JSON.parse(fileContents);
                const products = allProducts.map(function (product) {
                    if (product.id === id) {
                        return {id,name,price,url}
                    }
                    return product;
                });

                fs.writeFile(file, JSON.stringify(products), function (error) {
                    if (error !== null) {
                        console.log("error occured", error);
                        reject();
                    }
                    resolve();
                });

            });
        });
    }

    save() {
        console.log("save executing..");
        const { name, price, url } = this;
        return new Promise(function (resolve, reject) {
            fs.readFile(file, function (error, fileContents) {
                if (error !== null) {
                    console.log("error occured", error);
                    reject();
                }
                const products = JSON.parse(fileContents);
                products.push({ id: uuidv4(), name, price, url });
                fs.writeFile(file, JSON.stringify(products), function (error) {
                    if (error !== null) {
                        console.log("error occured", error);
                        reject();
                    }
                    resolve();
                });
            })

        });
    }
}