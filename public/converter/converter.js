document.getElementById("submitConvert").addEventListener("click", function (e) {
    e.preventDefault();

    let converterForm = document.forms["converterForm"];
    let inputValue = converterForm.elements["inputValue"].value;
    let outputValue = converterForm.elements["outputValue"];
    let inputMeasure = converterForm.elements["inputMeasure"].value;
    let outputMeasure = converterForm.elements["outputMeasure"].value;

    let convertData = JSON.stringify({distance: {unit: inputMeasure, value: inputValue}, convert_to: outputMeasure});
    let request = new XMLHttpRequest();


    request.open("POST", "/convert", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        let output = (JSON.parse(request.response));
        outputValue.value = output.value;
    });
    request.send(convertData);
});
