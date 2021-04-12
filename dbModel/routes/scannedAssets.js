const router = require("express").Router();
let Asset = require("../models/assets.model");
let ScannedAsset = require("../models/scannedAssets.model");
let AssetsNotInPosition = require("../models/assetsNotInPosition.model");

router.route("/").get((req, res) => {
  ScannedAsset.find()
    .then((scannedAssets) => res.json(scannedAssets))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/test").get((req, res) => {
  console.log(req.body);
  ScannedAsset.find()
    .then((scannedAssets) => res.json(scannedAssets))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/allTest").post((req, res) => {
  console.log(req.body);
  res.json("SUCCESSSS -----");
});

router.route("/addNewScannedAsset").post((req, res) => {
  var scannedRfidTag = req.body.ID;
  var scannedLocation = req.body.location;
  // ! New changes for Price: START
  var purchaseCost = req.body.purchaseCost;
  //!: END

  const newScannedAsset = new ScannedAsset({
    scannedRfidTag,
    scannedLocation,
    purchaseCost,
  });

  newScannedAsset
    .save()
    .then(() => res.json("Scanned Asset added"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateScannedAsset").post((req, res) => {
  ScannedAsset.findById(req.body._id)
    .then((scannedAssets) => {
      if (req.body.scannedRfidTag) {
        scannedAssets.scannedRfidTag = req.body.scannedRfidTag;
      }
      if (req.body.scannedLocation) {
        scannedAssets.scannedLocation = req.body.scannedLocation;
      }
      // ! New changes for Price: START
      if (req.body.purchaseCost) {
        scannedAssets.purchaseCost = req.body.purchaseCost;
      }
      //!: END
      scannedAssets
        .save()
        .then(() =>
          res.json("Scanned Asset with id " + req.body.id + " has been updated")
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/deleteScannedAssetById").delete((req, res) => {
  console.log(req.body);
  ScannedAsset.findByIdAndDelete(req.body.id)
    .then(() => res.json("Asset with id " + req.body.id + " has been deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/test").post((req, res) => {
  console.log("hello test");
  console.log(req.body);
  ScannedAsset.find()
    .then((scannedAssets) => res.json("hello"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/checkLocation").post(async (req, res) => {
  await ScannedAsset.deleteMany()
    .then(() =>
      console.log("All previously scanned asset data has been deleted")
    )
    .catch((err) => res.status(400).json("Error: " + err));

  await AssetsNotInPosition.deleteMany()
    .then(() =>
      console.log("All previously scanned asset data has been deleted")
    )
    .catch((err) => res.status(400).json("Error: " + err));

  var checkAssets = req.body;
  var location;
  console.log(checkAssets);
  for (var i = 0; i < checkAssets.length; i++) {
    var assetObj = checkAssets[i];
    if (!assetObj.scannedRfidTag) {
      continue;
    } else {
      if (!location) {
        location = assetObj.scannedLocation;
      } else {
        if (!(location === assetObj.scannedLocation)) {
          res.status(400).json("Multiple locations detected!");
        }
      }
      const scannedRfidTag = assetObj.scannedRfidTag;
      const scannedLocation = assetObj.scannedLocation;
      const tempAsset = new ScannedAsset({
        scannedRfidTag,
        scannedLocation,
      });

      tempAsset
        .save()
        .then(() => console.log(JSON.stringify(tempAsset)))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  }

  var result = [];
  Asset.find()
    .then((data) => {
      ScannedAsset.find()
        .then((scannedData) => {
          data.forEach((element) => {
            var there = false;
            var sameLoc = true;
            scannedData.forEach((scannedElement) => {
              if (element.location === location) {
                if (element.location === scannedElement.scannedLocation) {
                  if (element.rfidTag === scannedElement.scannedRfidTag) {
                    there = true;
                  }
                }
              } else {
                sameLoc = false;
              }
            });
            if (there === false && sameLoc === true) {
              result.push(element);
              const assetName = element.assetName;
              const rfidTag = element.rfidTag;
              const assetSerial = element.assetSerial;
              const model = element.model;
              console.log(model);
              const category = element.category;
              const status = element.status;
              const department = element.department;
              const checkedOutTo = element.checkedOutTo;
              const location = element.location;
              const purchaseCost = element.purchaseCost;

              var temp = new AssetsNotInPosition({
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
              });

              temp
                .save()
                .then(() => console.log(JSON.stringify(temp)))
                .catch((err) => res.status(400).json("Error: " + err));
            }
          });
          res.json(result);
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/deleteScannedData").delete((req, res) => {
  ScannedAsset.deleteMany()
    .then(() => res.json("All previously scanned asset data has been deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
