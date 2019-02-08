const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = updatedCartItems.findIndex(
        cartProduct => cartProduct.productId.toString() === product._id.toString()
    );
    if (cartProductIndex !== -1) {
        const cartProduct = updatedCartItems[cartProductIndex];
        cartProduct['quantity'] = cartProduct['quantity'] + 1;
        updatedCartItems[cartProductIndex] = cartProduct;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: 1
        })
    }
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteItemFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(
        item => item.productId.toString() !== productId.toString()
    );
    const updatedCart = {
        items: updatedCartItems
    }
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.clearCart = function () {
    this.cart = {
        items: []
    };
    return this.save();
}

module.exports = mongoose.model('User', userSchema)


