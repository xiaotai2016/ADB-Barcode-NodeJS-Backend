module.exports = {
  variableName: "variableValue",
  DATABASE_CONNECTION_STRING: "mongodb://dev1:Adb12#$sys@14.202.130.26/amsadb", //"mongodb://dev1:Adb12#$sys@14.202.130.26/amsb", //"mongodb://dev1:Adb12#$sys@204.93.167.131/amsb",

  USER_ROUTER: "./dbModel/routes/users",
  ASSET_ROUTER: "./dbModel/routes/assets",
  NOTIFICATION_ROUTER: "./dbModel/routes/notifications",
  SCANNED_ASSET_ROUTER: "./dbModel/routes/scannedAssets",

  USER_PATH: "/users",
  ASSET_PATH: "/assets",
  NOTIFICATION_PATH: "/notifications",
  SCANNED_ASSET_PATH: "/scannedAssets",
  BARCODE_PATH: "/barcode",

  TOKEN_SECRET: "tybcpamgwyuijshvugc",
};
