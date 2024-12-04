// On The Second Day Of Christmas My True Love Gave To Me
// Two Surveillance Pigeons 🕊️ 🕊️

class Boid {
    constructor(x, y, id) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.acceleration = createVector(0, 0);

        this.maxSpeed = 5
        this.maxForce = 0.2
        this.detectionRadius = 100
        this.desiredSeparation = 50.0

        // Steering forces
        this.separationWeight = 2.0
        this.alignmentWeight = 1.5
        this.cohesionWeight = 1.5
		this.landingWeight = 1.0 // Stronger weight for landing



        // for testing specific boids
        this.id = id

        // State machine --> initializes with flying 
        this.state = 'flying' // states: flying, landing, perched, takeoff

        // Energy system
        this.energy = random(40, 100)
        this.maxEnergy = 100
        this.energyDepletionRate = 0.1
        this.energyRecoveryRate = this.energyDepletionRate * 2
        this.landingThreshold = 30  // Energy level that triggers landing

        // Landing properties
        this.perch = null
        this.landingApproachDistance = 50

            // Takeoff properties
    this.takeoffRadius = 50; // Smaller radius for takeoff influence
    this.takeoffThreshold = 0.3; // 30% of nearby birds need to take off to trigger
    this.lastTakeoffTime = 0; // Track when this bird took off
    this.takeoffMemoryTime = 2000; // Remember takeoffs for 2 seconds
    }

    // State machine methods will go here
    setState(newState) {
        this.state = newState;
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

		// section for flying boids to avoid taking perched boids into account of their calulcation

		let count = 0;
		for (let boid of boids) {
			if (boid.state !== 'perched') {
				let sep = this.separate([boid]);
				let ali = this.align([boid]);
				let coh = this.cohesion([boid]);
	
				separation.add(sep);
				alignment.add(ali);
				cohesion.add(coh);
				count++;
			}
		}
	
		if (count > 0) {
			separation.div(count);
			alignment.div(count);
			cohesion.div(count);
		}

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
            // console.log(`separation ${separation}`)
            // console.log(`alignment ${alignment}`)
            // console.log(`cohesion ${cohesion}`)
            // console.log(this.acceleration)
        }
    }

	seek(target) {
        let desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    /*
    Function Name: separate
    Input: list of boids
    Return: the steering velocity the boid should use to avoid (getting too close) 
    to other boids
    Def: Calculates the average vector that its magnitude in inversely
    portionally to the distance of boids that fall in the desiredSeparation
    radius. 
    */
    separate(boids) {
        let sumVectors = createVector(0, 0)
        let boidInRad = 0

        for (let boid of boids) {
            const distance = p5.Vector.dist(this.position, boid.position)

            if (boid != this && distance < this.desiredSeparation) {
                // Get the difference (subtract) between the vectors
                let difference = p5.Vector.sub(this.position, boid.position)
                difference.normalize() // normalizes to have a magnitude of 1
                difference.div(distance) // inversely proportional to the distance
                sumVectors.add(difference)
                boidInRad++
            }
        }

        if (boidInRad > 0) {
            // let avgVelocity = sumVelocity / boidInRad
            sumVectors.div(boidInRad)
            sumVectors.normalize();
            sumVectors.mult(this.maxSpeed);
            sumVectors.sub(this.velocity);
            sumVectors.limit(this.maxForce);
        }

        return sumVectors;
    }

    /*
    Function Name: align
    Input: list of boids
    Return: the steering velocity the boid should use to reach the average
    velocity of the boids in the detection radius 
    Def: Calculates the avg velocity of boids in the dectection radius,
    normalizes the avg, then multiples by max speed.
    Calculates steer force (steer = desired v - current v) 
    and limit it to max force
    */
    align(boids) {
        let sumVelocity = createVector(0, 0)
        let boidsInRadius = 0

        // Summation of velocities in detection radius 
        for (let boid of boids) {
            const distance = p5.Vector.dist(this.position, boid.position)
            if (boid != this && distance < this.detectionRadius) {
                sumVelocity.add(boid.velocity)
                boidsInRadius++
            }
        }

        // Calculate steer velocity needed to reach average velocity in
        // detection radius, given there are other boids in the radius 
        if (boidsInRadius > 0) {
            let avgVelocity = sumVelocity
            avgVelocity.div(boidsInRadius)
            avgVelocity.normalize()
            avgVelocity.mult(this.maxSpeed)
            let steer = p5.Vector.sub(avgVelocity, this.velocity)
            steer.limit(this.maxForce)
            return steer
        }

        // otherwise, return steering velocity (0,0)
        // boid will continue using current velocity
        return createVector(0, 0);
    }

    /*
    Function Name: cohesion
    Input: list of boids
    Return: the steering velocity the boid should use to reach the average
    position of the boids in the detection radius 
    Def: Calculates the avg positions of boids in the dectection radius.
    Calculates desired velocity by subtract avg position from the current
    position to vector pointing from current boid to avg position, normalizes
    it, multiples by max speed.
    Calculates steer force (steer = desired v - current v) 
    and limit it to max force
    */
    cohesion(boids) {
        let sumPosition = createVector(0, 0)
        let boidInRad = 0

        for (let boid of boids) {
            const distance = p5.Vector.dist(this.position, boid.position)
            if (boid != this && distance < this.detectionRadius) {
                sumPosition.add(boid.position)
                boidInRad++
            }
        }

        if (boidInRad > 0) {
            let avgPosition = sumPosition
            avgPosition.div(boidInRad)

            let desired = p5.Vector.sub(avgPosition, this.position)
            desired.normalize()
            desired.mult(this.maxSpeed)
            let steer = p5.Vector.sub(desired, this.velocity)
            steer.limit(this.maxForce)

            return steer
        }

        return createVector(0, 0);

    }

    update() {
        console.log(this.state)
        switch (this.state) {
            case 'flying':
                this.updateFlying();
                break;
            case 'landing':
                this.updateLanding();
                break;
            case 'perched':
                this.updatePerched();
                break;
            case 'takeoff':
                this.updateTakeoff();
                break;
        }

        if (this.state == 'landing') {
            let speed = this.velocity.mag()
            this.velocity = p5.Vector.sub(this.perch.position, this.position)
            this.velocity.setMag(speed)
            this.velocity.limit(this.maxSpeed / 3)
            this.position.add(this.velocity)
            this.acceleration.mult(0)
        }
        if (this.state !== 'perched') {
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

        }

        // Wrap around screen
        if (this.position.x < 0) {
            this.position.x = width
        }
        if (this.position.x > width) {
            this.position.x = 0
        }
        if (this.position.y < 0) {
            this.position.y = height
        }
        if (this.position.y > height) {
            this.position.y = 0
        }
    }

    updateFlying() {
        // Deplete energy while flying
        this.energy = max(0, this.energy - this.energyDepletionRate);

        // Consider landing if energy is low
        if (this.energy < this.landingThreshold) {
            this.findLandingSpot();
        }
    }
    updateLanding() {
        if (this.perch.position) {
            let d = p5.Vector.dist(this.position, this.perch.position);
            if (d < 5) {
                this.setState('perched');
                this.position = this.perch.position.copy();
                this.velocity.mult(0);
            }
        }
    }
    updatePerched() {
        // Recover energy while perched
        this.energy = min(this.maxEnergy, this.energy + this.energyRecoveryRate);

        // Consider taking off if energy is high and neighbors are flying
        if (this.energy > this.maxEnergy * 0.8 && this.shouldTakeoff()) {
            this.setState('takeoff');
        }
    }
    updateTakeoff() {
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.setState('flying');
        this.perch.occupied = false;
        this.perch = null;
        this.lastTakeoffTime = millis();
    }
    findLandingSpot() {
        // This will be called from PowerLine class
        if (powerLine.findAvailablePerch(this)) {
            this.setState('landing');
        }
    }

    shouldTakeoff() {
        if (random(1) < 0.001) return true;
        
        let nearbyBirds = 0;
        let recentTakeoffs = 0;
        const currentTime = millis();
        
        // Check all other birds within takeoff radius
        for (let boid of flock.boids) {
            if (boid !== this) {
                const distance = p5.Vector.dist(this.position, boid.position);
                if (distance < this.takeoffRadius) {
                    nearbyBirds++;
                    
                    // Count birds that took off recently
                    if (currentTime - boid.lastTakeoffTime < this.takeoffMemoryTime) {
                        recentTakeoffs++;
                    }
                }
            }
        }
        
        // If enough nearby birds took off recently, take off too
        if (nearbyBirds > 0) {
            const takeoffRatio = recentTakeoffs / nearbyBirds;
            if (takeoffRatio > this.takeoffThreshold) {
                return true;
            }
        }
        
        return false;
    }

    draw() {
        // Draw direction triangle for all boids
        let arrowSize = 7;
        stroke(0, 0, 0);
        
        // Color based on energy level
        let energyColor = map(this.energy, 0, this.maxEnergy, 0, 255);
        stroke(energyColor, 200, 200);
        
        // Debug visualization only when debugMode is true
        if (debugMode && this.id == 0) {
            stroke(255, 0, 0);
            fill(255, 102, 102, 100);
            ellipse(this.position.x, this.position.y, this.detectionRadius * 2);
        }
    
        // Draw boid triangle
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        beginShape();
        vertex(0, -arrowSize / 2);
        vertex(10, 0);
        vertex(0, arrowSize / 2);
        endShape(CLOSE);
        pop();
    }
}
