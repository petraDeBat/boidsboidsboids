class Flock {
    constructor() {
        this.boids = [];
    }
    
    addBoid(x, y) {
        this.boids.push(new Boid(x, y));
    }
    
    run() {
        for (let boid of this.boids) {
            // go through every boid and pass in the other boid
            // so every boid knows where the other boids are
            // boid.run() --> update, draw
            boid.run(this.boids); 
        }
    }
} 