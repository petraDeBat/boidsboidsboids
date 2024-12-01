// On The Second Day Of Christmas My True Love Gave To Me
// Two Surveillance Pigeons 🕊️ 🕊️

class Boid {
    constructor(x, y, id) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector(0, 0);

        this.maxSpeed = 4
        this.maxForce = 0.2
		this.detectionRadius = 100
        this.desiredSeparation = 50.0

        // Steering forces
        this.separationWeight = 1.5;
        this.alignmentWeight = 1.0;
        this.cohesionWeight = 0.5;

		// for testing the boids
		this.id = id
    }
    
    run(boids) {
        this.flock(boids);
        this.update();
        this.draw();
    }

    flock(boids) {
        let separation = this.separate(boids);
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);

        // Weight these forces
        separation.mult(this.separationWeight);
        alignment.mult(this.alignmentWeight);
        cohesion.mult(this.cohesionWeight);

        // Add the forces to acceleration
        this.acceleration.add(separation);
        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);

        // console.log(this.acceleration)

		if (this.id == 0 && !(separation.x === 0 && separation.y === 0)) {
			console.log(`separation ${separation}`)
			console.log(`alignment ${alignment}`)
			console.log(`cohesion ${cohesion}`)
			console.log(this.acceleration)
		}
    }

    separate(boids) {
		// For each nearby boid, calculate a force pushing away from it
		// for each boid in boids...
			// if boid falls under radius
				// calulate difference in position between the two boids
		// get opposing vector (?????) and then average all opposing vectors together
				
		// return that vector

		let sumVectors = createVector(0, 0)
		let boidInRad = 0

		for (let boid of boids) {
			// const distance = Math.sqrt((this.position.x - boid.position.x) ** 2 + (this.position.y - boid.position.y) ** 2)
			const distance = p5.Vector.dist(this.position, boid.position)
			
            if ((distance > 0) && (distance < this.desiredSeparation)) {
				// if (this.id == 0) {console.log('WORKING?!?!')}
                // Get the difference (subtract) between the vectors
                let difference = p5.Vector.sub(this.position, boid.position)
                difference.normalize()
                difference.div(distance)
				sumVectors.add(difference)
				boidInRad++	
			}

		}


        if (boidInRad > 0) {
            // let avgVelocity = sumVelocity / boidInRad
            let avgVector = sumVectors.div(boidInRad)
            avgVector.mult(this.maxSpeed);
            avgVector.sub(this.velocity);
            avgVector.limit(this.maxForce);
            return avgVector
        }

        return sumVectors;

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
			// const distance = Math.sqrt((this.position.x - boid.position.x) ** 2 + (this.position.y - boid.position.y) ** 2)
			const distance = p5.Vector.dist(this.position, boid.position)
            if (distance < this.detectionRadius) {
				sumVelocity.add(boid.velocity)
				boidInRad++
			}
		}

        if (boidInRad > 0) {
            // let avgVelocity = sumVelocity / boidInRad
            sumVelocity.div(boidInRad)
            sumVelocity.normalize()
            sumVelocity.mult(this.maxSpeed)
            let steer = p5.Vector.sub(sumVelocity, this.velocity)
            steer.limit(this.maxForce)
            return steer
        }

        return createVector(0, 0);
    }

    cohesion(boids) {
		// Calculate the average position of nearby boids
		// for each boid in boids...
			// if boid falls under radius
				//get avg position  

		// ...return avg position so boid steers towards it?

		let sumPosition = createVector(0, 0)
		let boidInRad = 0

		for (let boid of boids) {
			// const distance = Math.sqrt((this.position.x - boid.position.x) ** 2 + (this.position.y - boid.position.y) ** 2)
			const distance = p5.Vector.dist(this.position, boid.position)
            if (distance > 0 && distance < this.detectionRadius) {
				sumPosition.add(boid.position)
				boidInRad++	
			}
		}

        if (boidInRad > 0) {
            // let avgVelocity = sumVelocity / boidInRad
            sumPosition.div(boidInRad)

            let desired = p5.Vector.sub(sumPosition, this.position);
            desired.normalize();
            desired.mult(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);

            return steer
        }

        return createVector(0, 0);
        
    }
    
    update() {
		// 0. Update velocity based on acceleration
		this.position.add(this.velocity)
		this.velocity.add(this.acceleration)
		this.velocity.limit(this.maxSpeed)
        this.acceleration.mult(0)
        // 1. Update position based on velocitry

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
		if (this.id == 0) {
			stroke(255, 0, 0)
			// draw radius
			noFill();
        	ellipse(this.position.x, this.position.y, this.detectionRadius * 2);
			
		} 
		else {
			stroke(0,0,0)
		}
        // 1. Draw a circle at this.position
		strokeWeight(5);
  		point(this.position);


		// Draw an arrow to show direction
		let arrowSize = 7;
		push();
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading());
		line(0, 0, 20, 0);
		line(20, 0, 20 - arrowSize, arrowSize / 2);
		line(20, 0, 20 - arrowSize, -arrowSize / 2);
		pop();
    }
}
