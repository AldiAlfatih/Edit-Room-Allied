let inputImage = document.getElementById('inputImage');
let outputCanvas = document.getElementById('outputCanvas');
let ctx = outputCanvas.getContext('2d');
let thresholdSelect = document.getElementById('thresholdSelect');

inputImage.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        uploadedImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

function processImage() {
    let img = new Image();
    img.onload = function() {
        outputCanvas.width = img.width;
        outputCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        applyThresholding();
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function applyThresholding() {
    let threshold = parseInt(thresholdSelect.value);
    let imgData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        let color = avg < threshold ? 0 : 255;
        data[i] = color;         // Red
        data[i + 1] = color;     // Green
        data[i + 2] = color;     // Blue
    }

    ctx.putImageData(imgData, 0, 0);
}

function downloadImage() {
    let downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL();
    downloadLink.download = 'binary-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function clearOutput() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}
