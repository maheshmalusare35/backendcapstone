const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = process.env.SECRET_KEY

const addFoodSchema = mongoose.Schema({
    food_name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: String,
        
        required: true
        
    },
    description : {
        type: String,
       
        required: true
        

    },
    placeholder: {
        
        
    },
    Stock: {
        type: String,
        enum : ["In-Stock","Out-Stock"],
        default: 'In-Stock'
        
    },
    restaurant_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum : ["Active","In-Active"],
        default: 'Active'
    },
    
    created_on: Date,
    
    updated_on: Date
})




const restaurantModal = new mongoose.model("ra_foods", addFoodSchema);

module.exports = restaurantModal;