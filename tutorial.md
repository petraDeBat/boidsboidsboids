# Building a Boid Simulation with p5.js

This tutorial will guide you through creating an interactive bird flocking simulation using p5.js. The simulation will feature autonomous agents (boids) that exhibit flocking behavior while managing their energy levels and interacting with the environment.

## Project Overview

The simulation models a flock of birds that can:
- Fly in formation using classic boid flocking rules
- Manage their energy levels
- Land on power lines to rest
- Influence each other's decisions to take off or land
- (Eventually) Move in 3D space

## Core Concepts

### Boids
Boids (bird-oids) were developed by Craig Reynolds in 1986 as a way to simulate flocking behavior. Each boid follows simple rules that, when combined, create complex emergent behavior:
1. Separation: Avoid crowding nearby flockmates
2. Alignment: Steer towards the average heading of nearby flockmates
3. Cohesion: Move toward the average position of nearby flockmates

### State Machines
Our birds will use a simple state machine to manage their behavior:
- Flying: Normal flocking behavior, consuming energy
- Landing: Approaching a landing spot on the power line
- Perched: Resting and regaining energy
- Takeoff: Transitioning from perched to flying

## Implementing Flocking Behavior

### Understanding Steering Forces
Flocking behavior is achieved through steering forces. Each force is calculated as a desired velocity minus the current velocity. The forces are:

1. **Separation Force**: Pushes boids away from nearby flockmates to prevent collisions
   - For each nearby boid, calculate a force pushing away from it
   - The closer the neighbor, the stronger the force
   - This prevents overcrowding and collisions

2. **Alignment Force**: Matches velocity with nearby flockmates
   - Calculate the average velocity of nearby boids
   - Steer towards that average velocity
   - This creates coordinated movement

3. **Cohesion Force**: Moves boids toward the center of nearby flockmates
   - Calculate the average position of nearby boids
   - Create a force steering toward that position
   - This keeps the flock together

### Implementation Strategy
To implement flocking:
1. Create methods to find nearby flockmates (within a certain radius)
2. Implement each force calculation separately
3. Combine forces using weights to control their relative influence
4. Apply the combined force to the boid's acceleration

The magic of flocking comes from balancing these forces. Try adjusting the weights and detection radii to create different flocking styles!

## Project Structure

The project is organized into several key classes:

### Boid Class
Represents individual birds and handles:
- Position, velocity, and acceleration
- Energy management
- State machine logic
- Steering behaviors
- Drawing

### Flock Class
Manages the collection of boids and:
- Stores all boid instances
- Updates all boids each frame
- Facilitates communication between boids

### PowerLine Class
Represents the environment and:
- Provides landing spots for birds
- Tracks which spots are occupied
- Handles visualization

## Initial Setup

To get started, we need:
1. A basic HTML page that loads p5.js and our script files
2. A canvas to draw on
3. Basic movement and rendering for our boids

At this stage, the boids will move in straight lines and wrap around the screen edges. They'll be rendered as simple triangles pointing in their direction of travel.

[Next sections will cover implementing flocking behavior, energy systems, and landing mechanics...] 