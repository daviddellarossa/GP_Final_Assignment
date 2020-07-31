let boxSize = 50;
let cameraRotationRadius = 800 * 1.414 //800 * sqrt(2) = rotation radius of the camera
let cameraRotationInitialAngle = 45;
let cameraRotationSpeed = 0.1;
let confLocs = [];
let confTheta = [];

function populateConfettiArrays(){
    for(let i = 0; i < 200; i++){
        confLocs.push(
            createVector(random(-500, 500), random(-800, 0), random(-500, 500))
        );
        confTheta.push(random(0, 360));
    }
}

function confetti(){
    for(let i = 0; i < confLocs.length; i++){
        push();
        noStroke();
        translate(confLocs[i]);
        rotateX(confTheta[i]);
        rotateZ(confTheta[i]/2);
        plane(15, 15);
        pop();

        confTheta[i] += 10;

        confLocs[i].y++;
        if(confLocs[i].y >= 0){
            confLocs[i].y = -800;
        }
    }
}

function setup() {
    createCanvas(900, 800, WEBGL);

    normalMaterial();
    stroke(0);
    strokeWeight(2);
    angleMode(DEGREES);

    populateConfettiArrays();
}

function drawBoxGrid(){
    for(let i = -400; i < 400; i += boxSize){
        for(let k = -400; k < 400; k += boxSize){
            push();
            translate(i, 0, k);
            let distance = dist(i, 0, k, 0, 0, 0) + frameCount;
            let length = ((sin(distance) + 1) * 100) + 100;
            box(boxSize, length, boxSize)
            pop();
        }
    }
}

function setCameraLocation(){
    let cameraX = cameraRotationRadius * cos(cameraRotationInitialAngle + frameCount * cameraRotationSpeed);
    let cameraZ = cameraRotationRadius * sin(cameraRotationInitialAngle + frameCount * cameraRotationSpeed);
    camera (cameraX, -600, cameraZ, 0,0,0, 0,1,0);
}

function draw() {
    background(125);
    setCameraLocation();
    drawBoxGrid();
    confetti();
}
