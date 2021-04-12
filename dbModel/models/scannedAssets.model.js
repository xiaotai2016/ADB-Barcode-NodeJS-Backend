const mongoose = require("mongoose");
var scannedAssetSchema = new mongoose.Schema({
  scannedRfidTag: String,
  scannedLocation: String,
  purchaseCost: String,
});

var ScannedAsset = mongoose.model("ScannedAsset", scannedAssetSchema);

module.exports = ScannedAsset;
