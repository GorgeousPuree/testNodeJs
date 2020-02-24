const path = require("path");
const fs = require("fs");
const cells = require("../utils/cells/cells");
const Population = require("../utils/cells/population");

exports.cells = function (request, response) {
    response.render(path.resolve() + "/public" + "/cells" + "/cells.hbs", {});
};

exports.uploadCells = function (request, response) {
    if(!request.file) {
        response.send("Error occurred while trying to load file.");
        return;
    }

    let data = fs.readFileSync(request.file.path,'utf8');
    try {
        let parsedData = JSON.parse(data);
        if(!cells.checkCells(parsedData)) {
            response.sendStatus(400);
            return;
        }
        let population = new Population(parsedData.corrections, parsedData.cells);
        let answer = population.Solve();
        console.log(answer);

        // I had some troubles with sending response, so I wrote this. I know that this is not the proper way.
        response.render(path.resolve() + "/public" + "/cells" + "/cells.hbs", {
            corrections: parsedData.corrections,
            cells: parsedData.cells,
            main_thruster: answer.main_thruster,
            secondary_thruster: answer.secondary_thruster,
            delta_velocity: answer.delta_velocity
        });
        return;
    } catch (e) {
        response.sendStatus(400);

    } finally {
        fs.unlinkSync(request.file.path);
    }
    response.end();
};
