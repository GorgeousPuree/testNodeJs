const path = require('path');

const rectangleSorter = require("../utils/rectangleSorter/rectangleSorter");

exports.rectangles = function (request, response) {
    response.sendFile(path.resolve() + "/public" + "/rectangles" + "/rectangles.html");
};

exports.sortRectangles = function (request, response) {
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
};


