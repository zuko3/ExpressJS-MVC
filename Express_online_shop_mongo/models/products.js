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

    edit(productId){
        const db = getDb();
        return db.collection('products')
        .updateOne({_id: new mongodb.ObjectID(productId)},{$set:{
            title:this.title,
            price:this.price,
            description:this.description,
            imageUrl:this.imageUrl
        }})
    }

    static delete(productId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({
            _id:new mongodb.ObjectID(productId)
        })
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