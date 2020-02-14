const path = require("path");
const fs = require("fs");
const converter = require("../utils/converter/converter");

exports.converter = function (request, response) {
    response.render(path.resolve() + "/public" + "/converter" + "/converter.hbs", {
        units: converter.units,
    });
};

exports.convert = function (request, response) {
    if(!request.body) {console.log("hi"); return response.sendStatus(400); }
    let requestedMeasures = request.body;
    let outputValue = converter.convertUnits(requestedMeasures);

    let convertOutput = JSON.stringify({unit: requestedMeasures.convert_to, value: outputValue});

    response.send(convertOutput);
};

exports.uploadUnits = function (request, response) {
    if(!request.file) {
        response.send("Error occurred while trying to load file.");
        return;
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
};

