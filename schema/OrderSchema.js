const {Schema}= require("mongoose");
const mongoose= require("mongoose");

const OrderSchema = new Schema({
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  orderBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports= {OrderSchema};