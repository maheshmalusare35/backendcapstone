const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = process.env.SECRET_KEY

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
       
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
        
    },
    mobile_number : {
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength: 10
        

    },
    opening_time: {
        type: String,
    },
    closing_time: {
        type: String,
    },
    address: {
        type: String,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
        
    },
    user_type: {
        type: String,
        required: true
        
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ],
    created_on: Date,
    
    updated_on: Date
})

// hash password

userSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    next()
});

userSchema.methods.generateAuthtoken = async function () {
    try {
        let tokenGen = jwt.sign({ _id: this._id }, keysecret, {
            expiresIn: "1d"
        });

        this.tokens = this.tokens.concat({ token: tokenGen });
        await this.save();
        return tokenGen;
    } catch (error) {
        console.log(error);
    }
}

const userModel = new mongoose.model("ra_users", userSchema);

module.exports = userModel;