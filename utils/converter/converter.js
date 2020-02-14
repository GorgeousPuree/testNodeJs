let units = [
    {unit: "cm", toCm: 1},
    {unit: "m", toCm: 100},
    {unit: "in", toCm: 2.54},
    {unit: "ft", toCm: 30.48},
];

module.exports.units = units;

module.exports.convertUnits = function convertMeasure(requestedMeasures) {
    let from = units.find(element => element.unit === requestedMeasures.distance.unit).toCm;
    let to = units.find(element => element.unit === requestedMeasures.convert_to).toCm;
    return (requestedMeasures.distance.value * from / to).toFixed(2);
};

module.exports.addUnit = function addUnit(dataUnits) {
    for (let i = 0; i < dataUnits.length; i++)
        units.push(dataUnits[i]);
};

module.exports.checkConverter = function(dataUnits) {
    if (!Array.isArray(dataUnits)) return false;
    for (let i = 0; i < dataUnits.length; i++)
        if (typeof dataUnits[i].unit !== "string" ||
            typeof dataUnits[i].toCm !== "number" ||
            units.filter(element => element.unit === dataUnits[i].unit).length > 0 ||
            dataUnits.filter(element => element.unit === dataUnits[i].unit).length !== 1) return false; // I should have used 'validate' or 'yup'
                                                                                                        // modules, but I realized that too late.
    return true;
};
