const jwt = require("jsonwebtoken")
const userModel = require("../Models/userModel");
const keySecret = process.env.SECRET_KEY


const authenticate = async(req,res,next)=>{


    try {

        const token  = req.headers.authorization
        
        const verifytoken = jwt.verify(token,keySecret)

        const rootUser = await userModel.findOne({_id:verifytoken._id});

        if(!rootUser) {throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next()



        
    } catch (error) {
        res.status(400).json({error:"Unauthorized no token provide"})
    }
}

module.exports = authenticate