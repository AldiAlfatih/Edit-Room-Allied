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
        detectEdges();
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function detectEdges() {
    let imgData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imgData.data;

    let kernelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ];

    let kernelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
    ];

    let grayscaleData = new Uint8Array(outputCanvas.width * outputCanvas.height);
    let sobelData = new Uint8Array(outputCanvas.width * outputCanvas.height);

    for (let i = 0; i < data.length; i += 4) {
        grayscaleData[i / 4] = (data[i] + data[i + 1] + data[i + 2]) / 3;
    }

    for (let y = 1; y < outputCanvas.height - 1; y++) {
        for (let x = 1; x < outputCanvas.width - 1; x++) {
            let pixelX = (
                kernelX[0][0] * grayscaleData[((y - 1) * outputCanvas.width) + (x - 1)] +
                kernelX[0][1] * grayscaleData[((y - 1) * outputCanvas.width) + x] +
                kernelX[0][2] * grayscaleData[((y - 1) * outputCanvas.width) + (x + 1)] +
                kernelX[1][0] * grayscaleData[(y * outputCanvas.width) + (x - 1)] +
                kernelX[1][1] * grayscaleData[(y * outputCanvas.width) + x] +
                kernelX[1][2] * grayscaleData[(y * outputCanvas.width) + (x + 1)] +
                kernelX[2][0] * grayscaleData[((y + 1) * outputCanvas.width) + (x - 1)] +
                kernelX[2][1] * grayscaleData[((y + 1) * outputCanvas.width) + x] +
                kernelX[2][2] * grayscaleData[((y + 1) * outputCanvas.width) + (x + 1)]
            );

            let pixelY = (
                kernelY[0][0] * grayscaleData[((y - 1) * outputCanvas.width) + (x - 1)] +
                kernelY[0][1] * grayscaleData[((y - 1) * outputCanvas.width) + x] +
                kernelY[0][2] * grayscaleData[((y - 1) * outputCanvas.width) + (x + 1)] +
                kernelY[1][0] * grayscaleData[(y * outputCanvas.width) + (x - 1)] +
                kernelY[1][1] * grayscaleData[(y * outputCanvas.width) + x] +
                kernelY[1][2] * grayscaleData[(y * outputCanvas.width) + (x + 1)] +
                kernelY[2][0] * grayscaleData[((y + 1) * outputCanvas.width) + (x - 1)] +
                kernelY[2][1] * grayscaleData[((y + 1) * outputCanvas.width) + x] +
                kernelY[2][2] * grayscaleData[((y + 1) * outputCanvas.width) + (x + 1)]
            );

            let magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
            sobelData[(y * outputCanvas.width) + x] = magnitude;
        }
    }

    let maxMagnitude = Math.max(...sobelData);
    let threshold = 100; 

    for (let i = 0; i < sobelData.length; i++) {
        let intensity = sobelData[i] * (255 / maxMagnitude);
        data[i * 4] = intensity > threshold ? 255 : 0; 
        data[i * 4 + 1] = intensity > threshold ? 255 : 0; 
        data[i * 4 + 2] = intensity > threshold ? 255 : 0; 
    }

    ctx.putImageData(imgData, 0, 0);
}


function downloadImage() {
    let downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL();
    downloadLink.download = 'edge-detected-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function clearOutput() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}
