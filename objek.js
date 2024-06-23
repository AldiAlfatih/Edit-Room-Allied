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
        detectObjects();
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function detectObjects() {

    let imgData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imgData.data;
    let threshold = 100;

    let grayscaleData = new Uint8Array(outputCanvas.width * outputCanvas.height);
    for (let i = 0; i < data.length; i += 4) {
        grayscaleData[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    }

    let binaryData = new Uint8Array(outputCanvas.width * outputCanvas.height);
    for (let i = 0; i < grayscaleData.length; i++) {
        binaryData[i] = grayscaleData[i] > threshold ? 255 : 0;
    }

    for (let i = 0; i < data.length; i += 4) {
        if (binaryData[i / 4] === 255) {  
            data[i] = 0;  
            data[i + 1] = 255;  
            data[i + 2] = 0;  

        }
    }
    ctx.putImageData(imgData, 0, 0);
}


function downloadImage() {
    let downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL();
    downloadLink.download = 'object-detected-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function clearOutput() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}
