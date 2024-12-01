let flock;

function setup() {
    createCanvas(800, 600) //canvas size

    // Initialize the flock
    flock = new Flock();

    // Create initial boids
    for (let i = 0; i < 20; i++) {
        flock.addBoid(random(width), random(height));
    }
}

function draw() {
    background(100) // grayscale value

    flock.run();
}
    // yay 4 indentation

