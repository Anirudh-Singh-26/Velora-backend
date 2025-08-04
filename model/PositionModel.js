const {model}= require("mongoose");
const {PositionSchema}= require("../schema/PositionSchema");

const Position= new model("Position", PositionSchema);

module.exports= {Position};