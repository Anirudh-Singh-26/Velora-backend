const {model}= require("mongoose");
const {StockSchema}= require("../schema/StockSchema.js");

const Stock= new model("Stock", StockSchema);

module.exports= {Stock};