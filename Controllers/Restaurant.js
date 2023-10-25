const moment = require("moment");
const restaurantModal = require("../Models/restaurantModal");
const userModel = require("../Models/userModel");
const customerModel = require("../Models/customerModal");
const order = require("../Models/ordersModal");
const mongoose = require('mongoose');
const multer = require('multer');

const { ObjectId } = require('mongodb');

exports.addFood = async(req, res) => {


    const file = req.file ? req.file.filename : "";
    const { food_name , quantity , price , description,  Stock, restaurant_id} = req.body;
    try {

        const created_on = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const FoodData = new restaurantModal({

            food_name,quantity,price,description,placeholder:file,Stock, restaurant_id,created_on: created_on,status:"Active"
        
        })

        const AddFoodDetails = await FoodData.save();

        if(AddFoodDetails){
            res.status(200).json({status:true, msg:"Food Added Successfully"});
        }

    } catch (error) {

        res.status(400).json(error);
        console.log("oops something went wrong.", error)
    }
}

exports.updateFood = async(req ,res) => {
    const  id  = req.params.id;
    const { food_name , quantity , price , description, placeholder, Stock, restaurant_id} = req.body;
    const file = req.file ? req.file.filename : placeholder
    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateFood = await restaurantModal.findByIdAndUpdate({ _id: id }, {
            food_name, quantity,price, description, placeholder : file ,Stock,restaurant_id,
            updated_on: dateUpdated
        }, {
            new: true
        });
        await updateFood.save();
        res.status(200).json({status: true, "msg": "food updated successfully"});

    } catch (error) {
        res.status(400).json(error);
        console.log("oops something went wrong.", error)
    }
}

exports.foodDelete = async (req, res) => {
    const  id  = req.params.id;

    try {
        const DeleteFood = await restaurantModal.findByIdAndDelete({ _id: id });
        if(DeleteFood){

            res.status(200).json({status: true, "msg": "food deleted successfully"});
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.getFoods = async (req, res) => {
    // console.log(usertype)
    
    try {
        const restaurant_id  = req.params.id;
        console.log(restaurant_id);
       
        const getAllFoods = await restaurantModal.find({ restaurant_id: restaurant_id });
        console.log(getAllFoods);
        res.status(200).json(getAllFoods);
    } catch (error) {
        res.status(400).json(error)
    }


}

exports.getSingleFoodData = async (req , res) => {

    try {
        const foodId = req.params.id;
        console.log(foodId);

        const getSingleFood = await restaurantModal.findOne({ _id: foodId });
        if(getSingleFood){
            res.status(200).json(getSingleFood);

        }else{
            res.status(404).json({ status: '404 Not Found' });
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.updateFoodStockStatus = async(req , res) => {

    try {
        console.log(req.params);
        // return false;

        const foodId = req.params.id;
        console.log(foodId);

        const getSingleFood = await restaurantModal.findOne({ _id: foodId },"Stock");
        // const getSingleFood = await restaurantModal.findOne({ _id: foodId });
        if(getSingleFood){
            console.log("sdadada",getSingleFood);
            
            var currentStockStatus  = getSingleFood.Stock;
            console.log("asdas", currentStockStatus);
            if(currentStockStatus == "In-Stock"){
                var stockStatus = "Out-Stock";
                
            }else{
                var stockStatus = "In-Stock";
            }
            const update = {
                Stock: stockStatus,
                
            };

            const updatedItem = await restaurantModal.findOneAndUpdate({ _id: foodId }, update, { new: true } );
            if (!updatedItem) {
                return res.status(404).json({ msg: 'Item not found' });
            }else{
                res.status(200).json({ msg: 'Stock status updated successfully' });
            }

        }else{
            
            return res.status(404).json({ msg: 'Item not found' });
            
            // res.status(404).json({ status: '404 Not Found' });
        }

    } catch (error) {
        res.status(400).json(error)
    }
}


exports.getAllOrdersData = async (req, res) => {
    // console.log(usertype)
    
    try {
        const restaurant_id  = req.params.id;

        const ObjectId = mongoose.Types.ObjectId;
        const restaurantId = new ObjectId(restaurant_id);
        const makerOb = new ObjectId();
        console.log(restaurantId);
       
        const restaurantOrders = await customerModel.aggregate([
            {
              $match: { restaurant_id:  restaurantId  },
            },
            {
                $lookup: {
                    from: "ra_users",
                    localField: "userId",
                    foreignField: "_id",
                    as:"userData",
                }
            },
            
            {
              $lookup: {
                from: 'ra_foods',
                localField: 'items.foodItemId',
                foreignField: '_id',
                as: 'foods',
              },
            },
            // Other aggregation stages for shaping the data as needed
          ])
        res.status(200).json(restaurantOrders);
    } catch (error) {
        res.status(400).json({error: error.message , status:"fafasf"});
    }


}

exports.updateStatusOfOrder = async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    // return false;
    const { order_status } = req.body;
    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateOrderStatus = await customerModel.findByIdAndUpdate({ _id: id }, {
            order_status,
            updated_on: dateUpdated
        }, {
            new: true
        });
        await updateOrderStatus.save();
        res.status(200).json({status: true, "msg": "order status updated successfully"});

    } catch (error) {
        res.status(400).json(error);
        console.log("oops something went wrong.", error)
    }
}