const router = require("express").Router();
var moment = require("moment");
let Notification = require("../models/notifications.model");
let User = require("../models/users.model");
let Asset = require("../models/assets.model");
let AssetsNotInPosition = require("../models/assetsNotInPosition.model");

router.route("/").get((req, res) => {
    var count = req.query.take || 10;
    count = parseInt(count);
    var sort = req.query.sort;
    var selector = "id";
    var order = 1;
    var desc = false;
    if (sort === undefined) {
        console.log("The sorting values are not sent");
    } else {
        selector = JSON.parse(sort)[0].selector;
        desc = JSON.parse(sort)[0].desc;
    }
    if (desc === true) {
        order = -1;
    }
    console.log(selector, desc);

    console.log(order);
    Notification.find()
        .limit(count)
        .sort([[selector, order]])
        .then((notifications) => res.json(notifications))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/checkLocationNotifications").get(async (req, res) => {
    var count = req.query.take || 10;
    count = parseInt(count);
    var sort = req.query.sort;
    var selector = "id";
    var order = 1;
    var desc = false;
    if (sort === undefined) {
        console.log("The sorting values are not sent");
    } else {
        selector = JSON.parse(sort)[0].selector;
        desc = JSON.parse(sort)[0].desc;
    }
    if (desc === true) {
        order = -1;
    }
    console.log(selector, desc);

    console.log(order);
    AssetsNotInPosition.find()
        .limit(count)
        .sort([[selector, order]])
        .then((assetsNotInPosition) => res.json(assetsNotInPosition))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addNotification").post((req, res) => {
    //console.log(req.body.values);
    const timestamp = moment(req.body.timestamp).format("YYYY-MM-DD HH:mm:ss") || moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(timestamp);
    const userId = req.body.userId;
    console.log(userId);
    const assetId = req.body.assetId;
    console.log(assetId);
    const description = req.body.description;
    console.log(description);

    var successUser = false;
    var successAsset = false;

    //check if user ID exists in Users database
    User.find()
        .then((dataUser) => {
            dataUser.forEach((elementUser) => {
                if (elementUser._id.equals(userId)) {
                    successUser = true;
                    //Since user Id exists check if asset ID exists in Assets database
                    Asset.find()
                        .then((dataAsset) => {
                            dataAsset.forEach((elementAsset) => {
                                if (elementAsset._id.equals(assetId)) {
                                    successAsset = true;
                                    //Both user ID and asset ID exist, so now create and save the notification
                                    var newNotification = new Notification({
                                        timestamp,
                                        userId,
                                        assetId,
                                        description,
                                    });
                                    newNotification
                                        .save()
                                        .then(() => res.json("Notification added"))
                                        .catch((err) => res.status(400).json("Error: " + err));
                                }
                            });
                            if (successAsset === false) {
                                console.log("Asset with id : " + assetId + " does not exist");
                                res.json("Asset with id : " + assetId + " does not exist");
                            }
                        })
                        .catch((err) => res.status(400).json("Error: " + err));
                }
            });
            if (successUser === false) {
                console.log("User with id : " + userId + " does not exist");
                res.json("User with id : " + userId + " does not exist");
            }
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route('/count').get((req, res) => {
    Notification.estimatedDocumentCount()
        .then(count => res.json(count.toString()))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/findNotificationById").get((req, res) => {
    Notification.findById(req.body.id)
        .then(notifications => res.json(notifications))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route("/deleteNotificationById").delete((req, res) => {
    Notification.findByIdAndDelete(req.body.id)
        .then(() => res.json("Notification with id " + req.body.id + " has been deleted"))
        .catch(err => res.status(400).json("Error: " + err));
});

router.route('/updateNotificationById').post((req, res) => {
    Notification.findById(req.body.id)
        .then(notifications => {
            if (req.body.timestamp) {
                notifications.timestamp = req.body.timestamp;
            }
            if (req.body.user) {
                notifications.user = req.body.user;
            }
            if (req.body.asset) {
                notifications.asset = req.body.asset;
            }
            if (req.body.description) {
                notifications.description = req.body.description;
            }
            notifications.save()
                .then(() => res.json('Notification with id ' + req.body.id + ' has been updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;