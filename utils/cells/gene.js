//exports.Gene = Gene;

class Gene {
    firstThruster = [];
    secondThruster = [];
    cells = [];
    loss = 0;

    constructor(thrusterLength, cellsCopy) {
        this.cells = cellsCopy.slice();
        this.firstThruster = new Array(thrusterLength).fill(0);
        this.secondThruster = new Array(thrusterLength).fill(0);
    }
}

module.exports = Gene;