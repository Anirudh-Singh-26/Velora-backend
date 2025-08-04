const {model}= require("mongoose");
const {UserSchema}= require("../schema/UserSchema.js");

const User= new model("User", UserSchema);

module.exports= {User};