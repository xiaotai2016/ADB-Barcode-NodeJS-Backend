const router = require("express").Router();
let Asset = require("../models/assets.model");
const { count } = require("../models/assets.model");

router.route("/").get((req, res) => {
  console.log("heer");
  var count = req.query.take || 10;
  count = parseInt(count);
  var sort = req.query.sort;
  var selector = "id";
  var order = 1;
  var desc = false;
  var skip = 0;
  if (sort === undefined) {
    console.log("The sorting values are not sent");
  } else {
    selector = JSON.parse(sort)[0].selector;
    desc = JSON.parse(sort)[0].desc;
  }
  if (desc === true) {
    order = -1;
  }
  if (req.query.skip !== undefined) {
    console.log(`Skip ${req.query.skip}`);
    let num = parseInt(req.query.skip, 10);
    if (Number.isInteger(num) === false) {
      console.log("Not int");
      skip = 10;
    } else {
      skip = num;
    }

    console.log(typeof skip);
  }
  // console.log(selector, desc);

  var totalCount = 10;
  // console.log(order);

  ///TODO : resolve the concurrency issue if it is there
  Asset.countDocuments(function (err, c) {
    // console.log(c);
    totalCount = c;
  });
  Asset.find()
    .skip(skip)
    .limit(count)
    .sort([[selector, order]])
    .then((assets) => {
      console.log("here");
      console.log(totalCount);
      res.json({ assets, totalCount });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addAsset").post((req, res) => {
  console.log(req.body.values);
  const assetName = req.body.values.assetName;
  console.log(assetName);
  const rfidTag = req.body.values.rfidTag || "";
  console.log(rfidTag);
  const assetSerial = req.body.values.assetSerial || "";
  console.log(assetSerial);
  const model = req.body.values.model || "";
  console.log(model);
  const category = req.body.values.category || ""; //
  console.log(category);
  const status = req.body.values.status || "";
  console.log(status);
  const department = req.body.values.department || "";
  console.log(department);
  const checkedOutTo = req.body.values.checkedOutTo || ""; //
  console.log(checkedOutTo);
  const location = req.body.values.location || ""; //
  console.log(location);
  const purchaseCost = req.body.values.purchaseCost || "";
  console.log(purchaseCost);
  const quantity = req.body.values.quantity || "1";

  //   TODO :- use the variable bellow
  const requestable = req.body.values.requestable || false;
  console.log(requestable);

  const newAsset = new Asset({
    assetName,
    rfidTag,
    assetSerial,
    model,
    category,
    status,
    department,
    checkedOutTo,
    location,
    purchaseCost,
    quantity,
  });

  //   res.json("Asset added");

  newAsset
    .save()
    .then(() => res.json("Asset added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/allStatus").get((req, res) => {
  Asset.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])
    .then((assets) => res.json(assets))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/allCategoryStatus").get((req, res) => {
  Asset.aggregate([
    {
      $group: {
        _id: { category: "$category", status: "$status" },
        count: { $sum: 1 },
      },
    },
  ])
    .then((assets) => {
      var data = [
        { category: "Others" },
        { category: "Vehicle" },
        { category: "IT Device" },
        { category: "Business Critical" },
      ];

      for (asset of assets) {
        var index = data.findIndex(
          (item) => item.category === asset._id.category
        );

        if (asset._id.status === "Available") {
          data[index][asset._id.status] = asset.count;
        }
        if (asset._id.status === "Assigned") {
          data[index][asset._id.status] = asset.count;
        }
        if (asset._id.status === "Broken") {
          data[index][asset._id.status] = asset.count;
        }
        if (asset._id.status === "Repair") {
          data[index][asset._id.status] = asset.count;
        }
      }
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/findAssetByRfidTag/:rfidTag").get((req, res) => {
  Asset.findOne({ rfidTag: req.params.rfidTag })
    .then((assets) => res.json(assets))
    .catch((err) => res.status(400).json("Error: " + err));
});

//API function to find the asset name by rfidTag
router.route("/findAssetNameByRfidTag/:rfidTag").get((req, res) => {
  Asset.findOne({ rfidTag: req.params.rfidTag })
    .then((assets) => res.json(assets.assetName))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/allCategories").get((req, res) => {
  console.log(req.query.category);
  let category = req.query.category;
  Asset.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ])
    .then((assets) => {
      let returnValue = assets;
      assets.forEach((item) => {
        if (item._id === category) {
          returnValue = item.count;
          console.log(returnValue);
          console.log(returnValue.count);
        }
      });

      res.json(returnValue);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/count").get((req, res) => {
  Asset.estimatedDocumentCount()
    .then((count) => res.json(count.toString))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/findAssetById").get((req, res) => {
  Asset.findById(req.body.id)
    .then((assets) => res.json(assets))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/deleteAssetById").delete((req, res) => {
  Asset.findByIdAndDelete(req.body.id)
    .then(() => res.json("Asset with id " + req.body.id + " has been deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateAssetById").post((req, res) => {
  Asset.findById(req.body.id)
    .then((assets) => {
      if (assets.__v) {
      } else {
        assets["__v"] = 0;
      }
      if (req.body.assetName) {
        assets.assetName = req.body.assetName;
      }
      if (req.body.rfidTag) {
        assets.rfidTag = req.body.rfidTag;
      }
      if (req.body.assetSerial) {
        assets.assetSerial = req.body.assetSerial;
      }
      if (req.body.model) {
        assets.model = req.body.model;
      }
      if (req.body.category) {
        assets.category = req.body.category;
      }
      if (req.body.status) {
        assets.status = req.body.status;
      }
      if (req.body.checkedOutTo) {
        assets.checkedOutTo = req.body.checkedOutTo;
      }
      if (req.body.location) {
        assets.location = req.body.location;
      }
      if (req.body.purchaseCost) {
        assets.status = req.body.status;
      }
      if (req.body.department) {
        assets.department = req.body.department;
      }
      if (req.body.purchaseCost) {
        assets.purchaseCost = req.body.purchaseCost;
      }
      assets
        .save()
        .then(() =>
          res.json("Asset with id " + req.body.id + " has been updated")
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
