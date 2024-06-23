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


// Menangani peristiwa saat gambar dipilih
inputImage.addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        uploadedImage.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

function processImage() {
    // Implementasi logika untuk menampilkan gambar pada outputCanvas
    const img = new Image();
    img.onload = function() {
        outputCanvas.width = img.width;
        outputCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
    img.src = uploadedImage.src;
}

function processImage() {
    let img = new Image();
    img.onload = function() {
        outputCanvas.width = img.width;
        outputCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        enhanceImage();
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function enhanceImage() {
    let imgData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imgData.data;

    let kernelSize = 3;
    let kernel = [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
    ];

    let kernelWeight = 16;

    for (let i = 0; i < data.length; i += 4) {
        let r = 0, g = 0, b = 0;

        // Terapkan kernel pengaburan
        for (let dy = 0; dy < kernelSize; dy++) {
            for (let dx = 0; dx < kernelSize; dx++) {
                let x = Math.min(outputCanvas.width - 1, Math.max(0, dx - 1 + (i / 4 % outputCanvas.width)));
                let y = Math.min(outputCanvas.height - 1, Math.max(0, dy - 1 + Math.floor(i / 4 / outputCanvas.width)));

                let pixelIndex = (y * outputCanvas.width + x) * 4;
                r += data[pixelIndex] * kernel[dy][dx];
                g += data[pixelIndex + 1] * kernel[dy][dx];
                b += data[pixelIndex + 2] * kernel[dy][dx];
            }
        }

        // Normalisasi dan setel warna piksel baru
        data[i] = r / kernelWeight;
        data[i + 1] = g / kernelWeight;
        data[i + 2] = b / kernelWeight;
    }

    ctx.putImageData(imgData, 0, 0);
}


function downloadImage() {
    let downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL();
    downloadLink.download = 'enhanced-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function clearOutput() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}