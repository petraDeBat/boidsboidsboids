// helloooo party people
// tis i 
// dadddy christmas
// hoe heo hoe
// 24 days till xmas

// youve been naughty lil boy this year

class Boid {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector(0, 0);

		this.detectionRadius = 50

        // Steering forces
        this.separationWeight = 1.5;
        this.alignmentWeight = 1.0;
        this.cohesionWeight = 1.0;
    }
    
    run(boids) {
        this.flock(boids);
        this.update();
        this.draw();
    }

    flock(boids) {
        // let separation = this.separate(boids);
        let alignment = this.align(boids);
        // let cohesion = this.cohesion(boids);

        // Weight these forces
        // separation.mult(this.separationWeight);
        alignment.mult(this.alignmentWeight);
        // cohesion.mult(this.cohesionWeight);

        // Add the forces to acceleration
        // this.acceleration.add(separation);
        this.acceleration.add(alignment);
        // this.acceleration.add(cohesion);
    }

	// TO-DO: create detection radius var

    separate(boids) {
		// For each nearby boid, calculate a force pushing away from it
		// for each boid in boids...
			// if boid falls under radius
				// calulate difference in position between the two boids
				// 1/(difference) to get a stronger force if boids are closer together
				
		// ..not sure exactly what return here, 


    }

    align(boids) {
		// Calculate the average velocity of nearby boids
		// for each boid in boids...
			// if boid falls under radius
				//get avg velocity 

		// ...return avg velocity so boid aims to reach it?

		let sumVelocity = createVector(0, 0)
		let boidInRad = 0

		for (let boid of boids) {
			const distance = Math.sqrt((this.position.x - boid.position.x) ** 2 + (this.position.y - boid.position.y) ** 2)
			// const distance = p5.Vector.dist(this.position, boid.position)
            if (distance < self.detectionRadius) {
				sumVelocity += boid.velocity
				boidInRad += 1	
			}
		}

        if (boidInRad > 0) {
            // let avgVelocity = sumVelocity / boidInRad
            let avgVelocity = sumVelocity.div(boidInRad)
            return avgVelocity
        }

        return createVector(0, 0);
    }

    cohesion(boids) {
		// Calculate the average position of nearby boids
		// for each boid in boids...
			// if boid falls under radius
				//get avg position  

		// ...return avg position so boid steers towards it?
        
    }
    
    update() {
		// 0. Update velocity based on acceleration
		this.velocity.add(this.acceleration)
        // 1. Update position based on velocitry
		this.position.add(this.velocity)

        // if (this.velocity.mag() > 30) {
        //     this.velocity.normalize()
        //     this.velocity = this.velocity * 30
        // }

        // console.log(this.velocity.mag())
        // 2. If it goes beyond the edge of the screen wrap it around
		// screen size width, height
		if (this.position.x < 0) {
			this.position.x = width
		}
		else if (this.position.x > width) {
			this.position.x = 0
		}
		else if (this.position.y < 0) {
			this.position.y = height
		}
		else if (this.position.y > height) {
			this.position.y = 0
		}
		else { 
			// do nothing
		}
	}
    
    draw() {
        // 1. Draw a circle at this.position
		strokeWeight(5);
  		point(this.position);
    }
}
