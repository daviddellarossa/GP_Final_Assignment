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
}
