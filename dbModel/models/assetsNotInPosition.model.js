const mongoose = require('mongoose');
var assetsNotInPositionSchema = new mongoose.Schema({

    assetName: String,
    rfidTag: String,
    assetSerial: String,
    model: String,
    category: String,
    status: String,
    department: String,
    checkedOutTo: String,
    location: String,
    purchaseCost: String
});

var AssetsNotInPosition = mongoose.model('AssetsNotInPosition', assetsNotInPositionSchema);

module.exports = AssetsNotInPosition;