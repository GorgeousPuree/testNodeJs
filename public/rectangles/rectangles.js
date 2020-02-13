function addRectangles() {
    let rectangleInputs = document.getElementById("rectangleInputs");
    let rectangleNumber = document.getElementById("rectanglesNumber").value;

    while (rectangleInputs.hasChildNodes())
        rectangleInputs.removeChild(rectangleInputs.lastChild);

    for (let i = 0; i < rectangleNumber; i++) {
        rectangleInputs.appendChild(document.createTextNode("Rectangle № " + (i + 1)));
        rectangleInputs.appendChild(document.createElement("br"));

        rectangleInputs.appendChild(document.createTextNode("height"));
        let inputHeight = document.createElement("input");
        rectangleInputs.appendChild(inputHeight);

        rectangleInputs.appendChild(document.createTextNode("Width"));
        let inputWidth = document.createElement("input");
        rectangleInputs.appendChild(inputWidth);
        inputHeight.type = "number";
        inputHeight.className = "height";
        inputWidth.type = "number";
        inputWidth.className = "width";

        rectangleInputs.appendChild(document.createElement("br"));
    }
}

document.getElementById("submitRectangles").addEventListener("click", function (e) {
    e.preventDefault();

    let heights = document.getElementsByClassName("height");
    let widths = document.getElementsByClassName("width");

    if (heights.length === 0 || widths.length === 0) {alert("Please fill all the fields."); return;}

    let rectangles = [];
    let regex = /^[0-9]+$/;

    for (let i = 0; i < heights.length; i++)  {
        if (!regex.test(heights[i].value) || !regex.test(widths[i].value)) {alert("Please fill all the fields."); rectangles = []; return;}
        let rectangle = {
            width: parseInt(widths[i].value, 10),
            height: parseInt(heights[i].value, 10),
        };
        rectangles.push(rectangle);
    }

    let convertData = JSON.stringify(rectangles);
    let request = new XMLHttpRequest();

    request.open("POST", "/sortRectangles", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        let rectangles = (JSON.parse(request.response));
        console.log(rectangles);
        draw(rectangles);
    });
    request.send(convertData);
});

function draw(enclosingRectangle) {
    let canvas = document.getElementById("rectanglesCanvas");
    let ctx = canvas.getContext('2d');

    const cw = 580;
    const ch = cw * enclosingRectangle.area_height / enclosingRectangle.area_width;

    canvas.width = cw * 2;
    canvas.height = ch * 2;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.scale(2, 2);

    const r = cw / enclosingRectangle.area_width;

    ctx.lineWidth = 0.5;
    for (const rectangle of enclosingRectangle.rectangles) {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`;
        ctx.rect(rectangle.position.x * r, rectangle.position.y * r, rectangle.size.width * r, rectangle.size.height * r);
        ctx.fill();
        ctx.stroke();
    }
}
