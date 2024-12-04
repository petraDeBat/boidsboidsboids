class PowerLine {
    constructor(y) {
        this.y = y
        this.perchPoints = []
        this.spacing = 10 // Space between possible perch points

        // Initialize perch points across the width of the canvas
        this.initPerchPoints()
    }

    initPerchPoints() {
        for (let x = 10; x < width; x += this.spacing) {
            this.perchPoints.push({
                position: createVector(x, this.y),
                occupied: false
            })
        }
    }

    draw() {
        // Draw the power line
        stroke(20)
        strokeWeight(2)
        line(0, this.y, width, this.y)
        
        // Only draw perch indicators in debug mode
        if (debugMode) {
            noStroke()
            for (let perch of this.perchPoints) {
                if (perch.occupied) {
                    fill(255, 0, 0) // Red for occupied
                } else {
                    fill(0, 255, 0) // Green for available
                }
                circle(perch.position.x, perch.position.y, 6) // Small circle for each perch point
            }
        }
    }

    findAvailablePerch(boid) {
        let closestDist = Infinity
        let closestPerch = null

        for (let perch of this.perchPoints) {
            if (!perch.occupied) {
                let d = p5.Vector.dist(boid.position, perch.position)
                if (d < closestDist) {
                    closestDist = d
                    closestPerch = perch
                }
            }
        }

        if (closestPerch) {
            closestPerch.occupied = true
            boid.perch = closestPerch
            return true
        }
        return false
    }

    releasePerch(position) {
        for (let perch of this.perchPoints) {
            if (perch.position.equals(position)) {
                perch.occupied = false
                break
            }
        }
    }
}