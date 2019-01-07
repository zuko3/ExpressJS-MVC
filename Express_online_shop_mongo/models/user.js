const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
    constructor(userName, email, cart, id) {
        this.userName = userName;
        this.email = email
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').inserOne(this);
    }

    addToCart(product) {
        const updatedCartItems = [...this.cart.items];
        const db = getDb();
        const cartProductIndex = updatedCartItems.findIndex(
            cartProduct => cartProduct.productId.toString() === product._id.toString()
        );
        if (cartProductIndex !== -1) {
            const cartProduct = updatedCartItems[cartProductIndex];
            cartProduct['quantity'] = cartProduct['quantity'] + 1;
            updatedCartItems[cartProductIndex] = cartProduct;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectID(product._id),
                quantity: 1
            })
        }
        return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
            $set: {
                cart: {
                    items: updatedCartItems
                }
            }
        })
    }

    deleteItemFromCart(productId) {
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(
            item => item.productId.toString() !== productId.toString()
        );
        return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
            $set: {
                cart: {
                    items: updatedCartItems
                }
            }
        })
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(item => item.productId)
        return db.collection('products').find({
            _id: { $in: productIds }
        }).toArray()
            .then(products => products.map(product => ({
                ...product,
                quantity: this.cart.items.find(item => item.productId.toString() === product._id.toString()).quantity
            })))
            .catch(err => console.log("[Error in getCart]:", err))
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectID(this._id),
                        userName: this.userName
                    }
                }
                return db.collection('orders').insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] };
                return db.collection('users').updateOne({ _id: new mongodb.ObjectID(this._id) }, {
                    $set: {
                        cart: {
                            items: []
                        }
                    }
                })
            }).catch(err => console.log("[Error in addOrder]:", err))
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({
            _id: new mongodb.ObjectID(userId)
        });
    }
}

module.exports = User;