const path = require("path");

exports.home = function (request, response) {
    response.sendFile(path.resolve() + "/public" + "/home.html");
};
