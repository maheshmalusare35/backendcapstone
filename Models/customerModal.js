const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = process.env.SECRET_KEY

const orderFoodSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    items: [
        {
          foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
          quantity: Number,
        },
    ],
    total: {
        type: String,
        required : true,
    },
    order_status: {
        type: String,
        enum : ["Accepted","Rejected","Pending","Delivered"],
        default: 'Pending'
        
    },
    created_on: Date,
    updated_on: Date
})

const orderFoodModal = new mongoose.model("ra_orders", orderFoodSchema);

module.exports = orderFoodModal;