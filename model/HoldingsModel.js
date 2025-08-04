const {model}= require("mongoose");
const {HoldingsSchema}= require("../schema/HoldingsSchema.js")

const Holding= new model("Holding", HoldingsSchema);

module.exports= {Holding};