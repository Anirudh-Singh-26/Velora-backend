const {Schema}= require("mongoose");
const StockSchema = new Schema({
  name: String,
  price: Number,
  percent: String,
  isDown: Boolean,
  lastUpdated: Date,
});

module.exports = { StockSchema };