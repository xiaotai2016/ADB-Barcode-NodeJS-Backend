<<<<<<< HEAD
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const verify = require("./validations/verifyToken");
// to access constant variables
const constants = require("./variables/constants");
var cors = require("cors");
// require("dotenv").config();
app.use(cors());
const port = constants.PORT || 3071;

app.use(express.json());

mongoose.connect(constants.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database is Online!");
});

const usersRouter = require(constants.USER_ROUTER);
const assetsRouter = require(constants.ASSET_ROUTER);
const notificationsRouter = require(constants.NOTIFICATION_ROUTER);
const scannedAssetsRouter = require(constants.SCANNED_ASSET_ROUTER);
const barcodeRoute = require("./dbModel/routes/barcode");

app.use(constants.USER_PATH, usersRouter);
app.use(constants.ASSET_PATH, assetsRouter);
app.use(constants.NOTIFICATION_PATH, notificationsRouter);
app.use(constants.SCANNED_ASSET_PATH, scannedAssetsRouter);
app.use(constants.BARCODE_PATH, verify, barcodeRoute);

app.get("/", (req, res) =>
  res.json("Assets Management Software by ADB Systems!")
);

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
=======
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const verify = require("./validations/verifyToken");
// to access constant variables
const constants = require("./variables/constants");
var cors = require("cors");
// require("dotenv").config();
app.use(cors());
const port = constants.PORT || 3071;

app.use(express.json());

mongoose.connect(constants.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database is Online!");
});

const usersRouter = require(constants.USER_ROUTER);
const assetsRouter = require(constants.ASSET_ROUTER);
const notificationsRouter = require(constants.NOTIFICATION_ROUTER);
const scannedAssetsRouter = require(constants.SCANNED_ASSET_ROUTER);
const barcodeRoute = require("./dbModel/routes/barcode");

app.use(constants.USER_PATH, usersRouter);
app.use(constants.ASSET_PATH, assetsRouter);
app.use(constants.NOTIFICATION_PATH, notificationsRouter);
app.use(constants.SCANNED_ASSET_PATH, scannedAssetsRouter);
app.use(constants.BARCODE_PATH, verify, barcodeRoute);

app.get("/", (req, res) =>
  res.json("Assets Management Software by ADB Systems!")
);

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
>>>>>>> e320a3ff2d23dce34e57f2961c6090c21bf43da8
