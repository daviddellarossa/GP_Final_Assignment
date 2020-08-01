// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  let resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = sepiaFilter(imgIn);
  resultImg = darkCorners(resultImg);
  resultImg = radialBlurFilter(resultImg);
  resultImg = borderFilter(resultImg)
  return resultImg;
}

function sepiaFilter(img){
    let result = createImage(img.width, img.height);

    result.loadPixels();
    img.loadPixels();

    for (let x = 0; x < result.width; x++) {
        for (let y = 0; y < result.height; y++) {

            let index = (x + y * result.width) * 4;

            let oldRed = img.pixels[index + 0];
            let oldGreen = img.pixels[index + 1];
            let oldBlue = img.pixels[index + 2];

            let newRed = constrain((oldRed * .393) + (oldGreen *.769) + (oldBlue * .189), 0, 255);
            let newGreen = constrain((oldRed * .349) + (oldGreen *.686) + (oldBlue * .168), 0, 255);
            let newBlue = constrain((oldRed * .272) + (oldGreen *.534) + (oldBlue * .131), 0, 255);

            result.pixels[index + 0] = newRed;
            result.pixels[index + 1] = newGreen;
            result.pixels[index + 2] = newBlue;
            result.pixels[index + 3] = 255;
        }
    }
    result.updatePixels();
    return result;
}

function darkCorners(img){
    let result = createImage(img.width, img.height);

    result.loadPixels();
    img.loadPixels();

    let halfDiagonal = dist(0, 0, img.width/2, img.height/2);

    for (let x = 0; x < result.width; x++) {
        for (let y = 0; y < result.height; y++) {

            let index = (x + y * result.width) * 4;

            let distanceFromCentre = dist(x, y, img.width/2, img.height/2);

            let dynLum = 1;
            if(distanceFromCentre >= 300 && distanceFromCentre < 450){
                dynLum = constrain(map(distanceFromCentre, 300, 450, 1, 0.4), 0, 1);
            }else if(distanceFromCentre >= 450){
                dynLum = constrain(map(distanceFromCentre, 450, halfDiagonal, 0.4, 0), 0, 1);
            }

            let oldRed = img.pixels[index + 0];
            let oldGreen = img.pixels[index + 1];
            let oldBlue = img.pixels[index + 2];

            let newRed = oldRed * dynLum;
            let newGreen = oldGreen * dynLum;
            let newBlue = oldBlue * dynLum;

            result.pixels[index + 0] = newRed;
            result.pixels[index + 1] = newGreen;
            result.pixels[index + 2] = newBlue;
            result.pixels[index + 3] = 255;
        }
    }
    result.updatePixels();
    return result;
}

function radialBlurFilter(img) {
    let result = createImage(img.width, img.height);
    var matrixSize = matrix.length;

    result.loadPixels();
    img.loadPixels();

    for (let x = 0; x < result.width; x++) {
        for (let y = 0; y < result.height; y++) {

            let index = (x + y * result.width) * 4;
            var c = convolution(x, y, matrix, matrixSize, img);

            let dynBlur = constrain(map(dist(x, y, mouseX, mouseY), 0, 300, 0, 1), 0, 1);

            let oldRed = img.pixels[index + 0];
            let oldGreen = img.pixels[index + 1];
            let oldBlue = img.pixels[index + 2];

            result.pixels[index + 0] = c[0]*dynBlur + oldRed*(1-dynBlur);
            result.pixels[index + 1] = c[1]*dynBlur + oldGreen*(1-dynBlur);
            result.pixels[index + 2] = c[2]*dynBlur + oldBlue*(1-dynBlur);
            result.pixels[index + 3] = 255;

        }
    }
    result.updatePixels();
    return result;
}

function convolution(x, y, matrix, matrixSize, img) {
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    var offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (var i = 0; i < matrixSize; i++) {
        for (var j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            var index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}

function borderFilter(img){
    let borderWidth = 10;
    let resultImg = createGraphics(imgIn.width, imgIn.height);
    resultImg.image(img, 0, 0);
    resultImg.stroke(255);
    resultImg.noFill();
    resultImg.strokeWeight(borderWidth * 2);
    resultImg.rect(borderWidth, borderWidth, img.width - (borderWidth * 2), img.height - (borderWidth * 2), 5 * borderWidth);
    resultImg.rect(borderWidth, borderWidth, img.width - (borderWidth * 2), img.height - (borderWidth * 2));
    return resultImg;
}