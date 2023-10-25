const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', // Reference to the Restaurant model
  },
  items: {
    foodItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food', // Reference to the Food model
      }
    ],
  },
  order_status: String,
  created_on: Date,
  // Other order-related fields
});

module.exports = mongoose.model('Order', orderSchema);
