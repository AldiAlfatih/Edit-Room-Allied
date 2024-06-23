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
        uploadedImage.src = URL.createObjectURL(inputImage.files[0]);
        outputCanvas.width = img.width;
        outputCanvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resizeImage();
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function resizeImage() {
    let img = new Image();
    img.onload = function() {
        let width = document.getElementById('widthInput').value;
        let height = document.getElementById('heightInput').value;

        outputCanvas.width = width;
        outputCanvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
    };
    img.src = URL.createObjectURL(inputImage.files[0]);
}

function downloadImage() {
    let downloadLink = document.createElement('a');
    downloadLink.href = outputCanvas.toDataURL();
    downloadLink.download = 'resized-image.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function clearOutput() {
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    uploadedImage.src = '';
}
