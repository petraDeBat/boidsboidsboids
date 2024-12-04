let flock;
let powerline;
let debugMode = false;

function setup() {
    createCanvas(1200, 700) //canvas size

    // Initialize the flock
    flock = new Flock();

    // Create initial boids
    for (let i = 0; i < 50; i++) {
        flock.addBoid(random(width), random(height), i);
    }

    // Create power line
    powerLine = new PowerLine(height * 0.7);
}

function draw() {
    background(100) // grayscale value

    // Draw power line
    powerLine.draw();

    flock.run();
}
    // yay 4 indentation

function keyPressed() {
    if (key === 'p' || key === 'P') {
        debugMode = true;
    }
}

function keyReleased() {
    if (key === 'p' || key === 'P') {
        debugMode = false;
    }
}

