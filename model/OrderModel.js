const {model}= require("mongoose");
const {OrderSchema}= require("../schema/OrderSchema.js");

const Order = new model("Order", OrderSchema);

module.exports = { Order };