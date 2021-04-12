const mongoose = require("mongoose");
var assetSchema = new mongoose.Schema({
  assetName: String,
  rfidTag: String,
  assetSerial: String,
  model: String,
  category: String,
  status: String,
  department: String,
  checkedOutTo: String,
  location: String,
  purchaseCost: String,
  quantity: String,
});

var Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
