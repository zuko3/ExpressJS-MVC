const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
let db  = null;

const mongoConnect = callbackFunc => {
    mongoClient.connect('mongodb+srv://onlineshop:onlineshop@cluster0-rndbr.mongodb.net/test?retryWrites=true')
        .then(client => {
            db = client.db()
            callbackFunc()
        })
        .catch(err => {
            console.log("[Error]:", err);
            throw err;
        })
}

const getDb = () =>{
    if(db) return db
    else throw new Error("Connection null")
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

