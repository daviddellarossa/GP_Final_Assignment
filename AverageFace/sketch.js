let imgs = [];
let avgImg;
let numOfImages = 30;

//////////////////////////////////////////////////////////
async function preload() { // preload() runs once
    for(let i = 0; i < numOfImages; i++){
        imgs.push(await loadImage(`assets/${i}.jpg`));
    }
}
//////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgs[0].width * 2, imgs[0].height);
    pixelDensity(1);
    avgImg = createGraphics(imgs[0].width, imgs[0].height);

}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgs[0], 0, 0);

    for(let i = 0; i < numOfImages; i++){
        imgs[i].loadPixels();
    }
    avgImg.loadPixels();

    for(let x = 0; x < imgs[0].width; x++){
        for(let y = 0; y < imgs[0].height; y++){
            let pixIdx = (y * imgs[0].width + x) * 4;
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            for(let i = 0; i < imgs.length; i++){
                sumR += imgs[i].pixels[pixIdx + 0];
                sumG += imgs[i].pixels[pixIdx + 1];
                sumB += imgs[i].pixels[pixIdx + 2];
            }
            avgImg.pixels[pixIdx + 0] = sumR/imgs.length;
            avgImg.pixels[pixIdx + 1] = sumG/imgs.length;
            avgImg.pixels[pixIdx + 2] = sumB/imgs.length;
            avgImg.pixels[pixIdx + 3] = 255;
        }
    }
    avgImg.updatePixels();

    image(avgImg, imgs[0].width, 0);
    noLoop();
}
