const mongoose = require('mongoose');
var newUserSchema = new mongoose.Schema({

    firstName: String,
    lastName: String,
    role: String,
    userName: String,
    email: String,
    phone: String,
    department: String,
    location: String,
    manager: String,
    password: String,
    cPassword: String,
    loginEnabled: String,
    notes: String
});

var User = mongoose.model('User', newUserSchema);

module.exports = User;
