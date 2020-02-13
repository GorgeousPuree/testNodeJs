// during solving the task, Richard E. Korf's article has been studied
// https://pdfs.semanticscholar.org/1120/310a8334043e0ff03d065ca9700f36746f18.pdf

// still this solution might seem not very optimal with small number of rectangles

module.exports.sortRectangles = function(rectangles) {
    let area = 0; // summary area
    let maxWidth = 0;

    for (const rectangle of rectangles) {
        rectangle.position = {};
        rectangle.size = {};

        rectangle.size.width = rectangle.width;
        rectangle.size.height = rectangle.height;
        delete rectangle.width;
        delete rectangle.height;

        area += rectangle.size.width * rectangle.size.height;
        maxWidth = Math.max(maxWidth, rectangle.size.width);
    }

    // sort the rectangles for insertion by height, descending
    rectangles.sort((a, b) => b.size.height - a.size.height);

    // aim for a squarish resulting container,
    // slightly adjusted for sub-100% space utilization
    const startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxWidth);

    // start with a single empty space, unbounded at the bottom
    const spaces = [{x: 0, y: 0, w: startWidth, h: Infinity}];

    let width = 0;
    let height = 0;

    for (const rectangle of rectangles) {
        // look through spaces backwards so that we check smaller spaces first
        for (let i = spaces.length - 1; i >= 0; i--) {
            const space = spaces[i];

            // look for empty spaces that can accommodate the current rectangle
            if (rectangle.size.width > space.w || rectangle.size.height > space.h) continue;

            // found the space; add the rectangle to its top-left corner
            // |-------|-------|
            // |  rectangle  |       |
            // |_______|       |
            // |         space |
            // |_______________|
            rectangle.position.x = space.x;
            rectangle.position.y = space.y;

            height = Math.max(height, rectangle.position['y'] + rectangle.size.height);
            width = Math.max(width, rectangle.position['x'] + rectangle.size.width);

            if (rectangle.size.width === space.w && rectangle.size.height === space.h) {
                // space matches the rectangle exactly; remove it
                const last = spaces.pop();
                if (i < spaces.length) spaces[i] = last;

            } else if (rectangle.size.height === space.h) {
                // space matches the rectangle height; update it accordingly
                // |-------|---------------|
                // |  rectangle  | updated space |
                // |_______|_______________|
                space.x += rectangle.size.width;
                space.w -= rectangle.size.width;

            } else if (rectangle.size.width === space.w) {
                // space matches the rectangle width; update it accordingly
                // |---------------|
                // |      rectangle      |
                // |_______________|
                // | updated space |
                // |_______________|
                space.y += rectangle.size.height;
                space.h -= rectangle.size.height;

            } else {
                // otherwise the rectangle splits the space into two spaces
                // |-------|-----------|
                // |  rectangle  | new space |
                // |_______|___________|
                // | updated space     |
                // |___________________|
                spaces.push({
                    x: space.x + rectangle.size.width,
                    y: space.y,
                    w: space.w - rectangle.size.width,
                    h: rectangle.size.height
                });
                space.y += rectangle.size.height;
                space.h -= rectangle.size.height;
            }
            break;
        }
    }

    return {
        w: width,  // enclosing rectangle width
        h: height, // enclosing rectangle height
    };
};

module.exports.checkRectangles = function(dataRectangles) {
    if (!Array.isArray(dataRectangles)) return false;
    for(let i = 0; i < dataRectangles.length; i++) {
        if (typeof dataRectangles[i].height !== "number" ||
            typeof dataRectangles[i].width !== "number")
            return false;
    }
    return true;
};
