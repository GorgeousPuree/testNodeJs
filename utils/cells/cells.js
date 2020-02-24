module.exports.checkCells = function (dataCells) {
    let availableCells = [2, 4, 6, 8, 10];
    if (!Array.isArray(dataCells.corrections) || !Array.isArray(dataCells.cells)) return false;

    for (const correction of dataCells.corrections) if (typeof correction !== "number" || correction < 0) return false;
    for (const cell of dataCells.cells) if (typeof cell !== "number" || cell < 0 || !availableCells.includes(cell)) return false;

    return true;
};