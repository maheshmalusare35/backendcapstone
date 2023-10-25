const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");
const moment = require("moment");
const userModel = require("../Models/userModel");
const keysecret = process.env.SECRET_KEY


exports.registerUser = async (req, res) => {
    const {   first_name , last_name ,email, mobile_number , password ,user_type ,opening_time , closing_time ,address } = req.body;

    try {

        const existingEmail  = await userModel.findOne({ email: email });
        const existingMobile  = await userModel.findOne({ email: email });
        if(existingEmail){
            res.status(400).json({status:false, msg:"Entered email already exists"});
        }else if(existingMobile){
            res.status(400).json({status:false, msg:"Entered mobile number already exists"});
        }else{
            const created_on = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

            const UserData = new userModel({
                first_name,last_name,email,mobile_number,password,user_type,created_on: created_on,status:"Active",address,closing_time,opening_time
            })

            const RegisterUserDetails = await UserData.save();

            if(RegisterUserDetails){
                res.status(200).json({status:true, msg:"Your account has been successfully registered"});
            }
        }
    }catch (error) {

        res.status(400).json(error);
        console.log("oops something went wrong.", error)
     }
}

exports.login = async (req, res) => { 
    const { email, password } = req.body;
    try {

        const validEmail  = await userModel.findOne({ email: email });
        if(validEmail){

            const isMatch = await bcrypt.compare(password, validEmail.password);
            if(!isMatch){
                res.status(400).json({"status":false, msg:"entered password and email does not match"});
            }else{
                // token generate
                const token = await validEmail.generateAuthtoken();
                const result = {
                    validEmail,
                    token
                  }

                res.status(200).json({status:"true",msg:"Login successfully",res:result})
            }
        }else{
            res.status(400).json({status:false, msg:"No user exist with this email id please register your account"});
        }
    }catch (error) { 
        res.status(400).json(error);
        console.log("catch block error", error)
    }
}

exports.ValidUser = async (req, res) => {


    try {
      const ValidUserOne = await userModel.findOne({ _id: req.userId });
  
      res.status(200).json(ValidUserOne);
    } catch (error) {
      res.status(400).json(error);
    }
}

// logout User

exports.Logout = async (req, res) => {


    try {
      req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
        return curelem.token !== req.token
      });
  
      // res.clearCookie("usercookie",{path:"/"});
  
      req.rootUser.save();
  
      res.status(200).json({status:"true", msg: "you are logout" })
  
    } catch (error) {
      res.status(400).json(error)
    }
}

exports.getRestaurant = async (req, res) => {
    // console.log(usertype)
    
    try {
       
        
        const getAllFoods = await userModel.find({user_type:"Restaurant"});
        console.log(getAllFoods);
        res.status(200).json(getAllFoods);
    } catch (error) {
        res.status(400).json(error)
    }


}