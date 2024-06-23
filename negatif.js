let inputImage = document.getElementById('inputImage');
let uploadedImage = document.getElementById('uploadedImage');
let outputCanvas = document.getElementById('outputCanvas');
let ctx = outputCanvas.getContext('2d');

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
        applyNegative();
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function applyNegative() {
    let imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
}

function downloadImage() {
    let downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL();
    downloadLink.download = 'negative-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function clearOutput() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}
