// https://github.com/lindell/JsBarcode
const router = require("express").Router();
// var { createCanvas } = require("canvas");
var JsBarcode = require("jsbarcode");

// router.route("/").get((req, res) => {
//   // Canvas v1
//   //   var canvas = new Canvas();
//   // Canvas v2
//   var canvas = createCanvas();

//   JsBarcode(canvas, "Hello");

//   res.send(canvas);
// });

router.route("/one").get((req, res) => {
  const { DOMImplementation, XMLSerializer } = require("xmldom");
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument(
    "http://www.w3.org/1999/xhtml",
    "html",
    null
  );
  const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  JsBarcode(svgNode, "test", {
    xmlDocument: document,
  });

  const svgText = xmlSerializer.serializeToString(svgNode);
  res.send(svgText);
});
module.exports = router;
