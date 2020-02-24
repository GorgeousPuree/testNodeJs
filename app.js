const express = require("express");
const multer  = require("multer");
const homeController = require("./controllers/homeController");
const converterController = require("./controllers/converterController");
const rectangleController = require("./controllers/rectangleController");
const cellsController = require("./controllers/cellsController");

const app = express();
app.use(express.static(__dirname + '/public'));

// creating parser
const jsonParser = express.json();

app.get("/converter", converterController.converter);
app.post("/convert", jsonParser, converterController.convert);

app.get("/rectangles", rectangleController.rectangles);
app.post("/sortRectangles", jsonParser, rectangleController.sortRectangles);

const upload = multer({dest:"uploads"});
app.post("/uploadUnits", upload.single("filedata"), converterController.uploadUnits);

app.get("/cells", cellsController.cells);
app.post("/uploadCells", upload.single("filedata"), cellsController.uploadCells);

app.get("/home", homeController.home);
app.get("/", homeController.home);

app.listen(3000);
