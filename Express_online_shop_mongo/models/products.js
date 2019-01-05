const mongodb = require('mongodb');
const getDb = require("../util/database").getDb;

module.exports = class Products {
    constructor(title,imageUrl, description,price) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    
    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray();
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectID(prodId) }).next();
    }
}