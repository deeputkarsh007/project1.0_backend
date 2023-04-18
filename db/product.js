const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  catagory: String,
  company: String,
  price: String,
});
module.exports = mongoose.model("product", productSchema);
