const moment = require("moment");
const restaurantModal = require("../Models/restaurantModal");
const userModel = require("../Models/userModel");
const customerModel = require("../Models/customerModal");
const mongoose = require('mongoose');

exports.getFoods = async (req, res) => {
    // console.log(usertype)
    
    try {
       
        
        const getAllFoods = await restaurantModal.find();
        console.log(getAllFoods);
        res.status(200).json(getAllFoods);
    } catch (error) {
        res.status(400).json(error)
    }


}

exports.getFoodByRestaurant = async (req, res) => {
    // console.log(usertype)
    const restaurant_id = req.params.id;
    
    try {
       
        
        const getAllFoods = await restaurantModal.find({restaurant_id: restaurant_id});
        console.log(getAllFoods);
        res.status(200).json(getAllFoods);
    } catch (error) {
        res.status(400).json(error)
    }


}

exports.getCartFoods = async (req, res) => {

    
    try {
        const { foodIds } = req.query;
        console.log(foodIds);
        const idArray = foodIds.split(',');
        const data = await restaurantModal.find({ _id: { $in: idArray } });
        if(data){

            res.status(200).json(data); 
        }else{
            res.status(400).json({ msg:"Invalid response from restaurant"});
        }
        } catch (error) {
            res.status(400).json(error)
            console.log(error);
    }
}

exports.orderFoods = async (req, res) => {

    const { restaurant_id , userId, items ,total } = req.body;

    const created_on = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    const newOrder = new customerModel({
        restaurant_id,userId,items,created_on: created_on,order_status:"Pending" , total
    })

    const orderFoods = await newOrder.save();
   
    if(orderFoods){
        res.status(200).json({status:true, msg:"Your order has been placed successfully"});
    }
}

// exports.allOrderDataUser = async(req, res) => {

//     const user_id = req.params.id;
    
//     try {
       
        
//         // const getAllOrderData = await customerModel.find({user_id: user_id});
//         // console.log(getAllOrderData);
//         // res.status(200).json(getAllOrderData);
//         try {
//             const orders = await customerModel.aggregate([
//               {
//                 $lookup: {
//                   from: 'ra_users',
//                   localField: 'user_id',
//                   foreignField: '_id',
//                   as: 'user',
//                 },
//               },
//               {
//                 $unwind: '$user',
//               },
//               {
//                 $lookup: {
//                   from: 'ra_food',
//                   localField: 'items.foodItemId',
//                   foreignField: '_id',
//                   as: 'foodItems',
//                 },
//               },
//             ]);
        
//             res.json(orders);
//           } catch (error) {
//             res.status(500).json({ error: 'Error fetching data' });
//           }
//     } catch (error) {
//         res.status(400).json(error)
//     }

// }
exports.allOrderDataUser = async(req, res) => {

    try {
        
        const user_id = req.params.id;  

        // const user = await userModel.findById(user_id);
        // const orders = await customerModel.find({ userId: user_id }).populate({path:'items.foodItemId',model:"ra_foods"}).exec();
        // res.status(200).json({  orders });
        const ObjectId = mongoose.Types.ObjectId;
        const userId = new ObjectId(user_id);
        console.log(userId);

        const userWithOrders = await userModel.aggregate([
            {
              $match: { _id: userId },
            },
            {
                $lookup: {
                  from: 'ra_orders',
                  let: { userId: '$_id' }, // Alias for the _id field in ra_users
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$userId', '$userId'], // Compare the userId field with the _id alias
                        },
                      },
                    },
                  ],
                  as: 'orders',
                },
              },

            //   
            // {
            //   $lookup: {
            //     from: 'ra_orders',
            //     localField: '_id',
            //     foreignField: 'userId',
            //     as: 'orders',
            //   },
            // },

            {
              $unwind: '$orders',
            },

            {
                $lookup: {
                  from: 'ra_orders',
                  let: { restaurantId: '$orders.restaurant_id' }, // Alias for the restaurant_id field
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                            $eq: [{ $toString: '$userId' }, ''], // Compare the _id field with the restaurantId alias
                        },
                      },
                    },
                  ],
                  as: 'orders.restaurant',
                },
              },

            // {
            //   $lookup: {
            //     from: 'ra_orders',
            //     localField: 'orders.restaurant_id',
            //     foreignField: '_id',
            //     as: 'orders.restaurant',
            //   },
            // },


            {
              $lookup: {
                from: 'ra_foods',
                localField: 'orders.items.foodItemId',
                foreignField: '_id',
                as: 'orders.items.foodItems',
              },
            },
          ]);
          console.log(userWithOrders);
          res.json(userWithOrders);

    } catch (error) {
        res.status(400).json({error: error.message, status:"dads"});    
    }
    
   

}

exports.allOrderDataUser2 = async(req, res) =>{

  try {

    const user_id = req.params.id;  
    const ObjectId = mongoose.Types.ObjectId;
    const userId = new ObjectId(user_id);
    const makerOb = new ObjectId();

    const userWithOrders = await userModel.aggregate([
      {
        $match: { _id: userId },
      },

      {
        $lookup : {
          from: "ra_orders",
          localField: "userId",
          foreignField: "_id",
          as: "orders",
          
        },
      },
      {
        $lookup: {
          from: "ra_orders",
          localField: "orders.restaurant_id",
          foreignField: "_id",
          as: 'orders.restaurant',

        },
      },
      {
        $lookup: {
          from: 'ra_foods',
          localField: 'orders.items.foodItemId',
          foreignField: '_id',
          as: 'orders.items.foodItems',
        },
      },
    ]);
    console.log(userWithOrders);
          res.json(userWithOrders);

  } catch (error) {
    res.status(400).json({error: error.message, status:"dads"});    
  }
}

