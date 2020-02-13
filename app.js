const express = require("express");
const fs = require("fs");
const multer  = require("multer");
const converter = require("./utils/converter/converter");
const rectangleSorter = require("./utils/rectangleSorter/rectangleSorter");

const app = express();
//app.use(express.static(__dirname + '/public'));

// creating parser
const jsonParser = express.json();

app.get("/converter", function(request, response){
    response.render(__dirname + "/public" + "/converter" + "/converter.hbs", {
        units: converter.units,
    });
});

app.post("/convert", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    let requestedMeasures = request.body;
    let outputValue = converter.convertUnits(requestedMeasures);

    let convertOutput = JSON.stringify({unit: requestedMeasures.convert_to, value: outputValue});

    response.send(convertOutput);
});

app.get("/rectangles", function (request, response) {
    response.sendFile(__dirname + "/public" + "/rectangles" + "/rectangles.html");
});

app.post("/sortRectangles", jsonParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);

    let rectangles = request.body;
    if (!rectangleSorter.checkRectangles(rectangles)) {
        response.sendStatus(500);
        return;
    }
    let enclosingRectangle = rectangleSorter.sortRectangles(rectangles);

    let output = {
        area_width: enclosingRectangle.w,
        area_height: enclosingRectangle.h,
        rectangles: [],
    };

    for (let i = 0; i < rectangles.length; i++)
        output.rectangles.push(rectangles[i]);

    response.send(output);
});

const upload = multer({dest:"uploads"});
app.post("/uploadUnits", upload.single("filedata"), function (request, response) {
    if(!request.file) {
        response.send("Error occurred while trying to load file.");
        return response.sendStatus(500);
    }

    let data = fs.readFileSync(request.file.path,'utf8');
    try {
        let parsedData = JSON.parse(data);
        if(!converter.checkConverter(parsedData)) {
            response.sendStatus(400);
            return;
        }
        converter.addUnit(parsedData);

        response.redirect("/converter");
    } catch (e) {
        response.sendStatus(400);

    } finally {
        fs.unlinkSync(request.file.path);
    }
    response.end();
});

app.get("/capsules", function (request, response) {
    response.sendStatus(501);   // Sorry, I didn't have time to solve this task
});

app.get("/", function (request, response) {
   response.sendFile(__dirname + "/public" + "/home.html");
});

app.get("/home", function (request, response) {
    response.sendFile(__dirname + "/public" + "/home.html");
});

app.listen(3000);
