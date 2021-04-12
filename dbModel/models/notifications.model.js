const mongoose = require('mongoose');
var newNotificationSchema = new mongoose.Schema({
    timestamp: Date,
    userId: String,
    assetId: String,
    description: String
});

var Notification = mongoose.model('Notification', newNotificationSchema);

module.exports = Notification;
