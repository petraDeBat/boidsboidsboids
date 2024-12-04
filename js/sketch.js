let flock
let powerline
let debugMode = false

// Slider variables
let separationSlider, cohesionSlider, alignmentSlider
let maxSpeedSlider, detectionRadiusSlider 
let separationRadiusSlider
let energyDepletionSlider

// Parameters object to store values
let params = {}

// Default values object
const DEFAULT_VALUES = {
    separation: 2.0,
    cohesion: 1.5,
    alignment: 1.5,
    speed: 5.0,
    detection: 100,
    separationRad: 50,
    energy: 0.1
};

function setup() {
    createCanvas(1200, 700) //canvas size

    // Initialize sliders
    separationSlider = createSlider(0, 5, DEFAULT_VALUES.separation, 0.1)
    separationSlider.parent('separationSlider')
    
    cohesionSlider = createSlider(0, 5, DEFAULT_VALUES.cohesion, 0.1)
    cohesionSlider.parent('cohesionSlider')
    
    alignmentSlider = createSlider(0, 5, DEFAULT_VALUES.alignment, 0.1)
    alignmentSlider.parent('alignmentSlider')
    
    maxSpeedSlider = createSlider(1, 10, DEFAULT_VALUES.speed, 0.5)
    maxSpeedSlider.parent('speedSlider')
    
    detectionRadiusSlider = createSlider(20, 200, DEFAULT_VALUES.detection, 5)
    detectionRadiusSlider.parent('detectionSlider')
    
    separationRadiusSlider = createSlider(10, 100, DEFAULT_VALUES.separationRad, 5)
    separationRadiusSlider.parent('separationRadSlider')
    
    energyDepletionSlider = createSlider(0.01, 0.5, DEFAULT_VALUES.energy, 0.01)
    energyDepletionSlider.parent('energySlider')

    // Add reset button handler
    select('#resetButton').mousePressed(resetValues)

    // Initialize the flock
    flock = new Flock()

    // Create initial boids
    for (let i = 0; i < 100; i++) {
        flock.addBoid(random(width), random(height), i)
    }

    // Create power line
    powerLine = new PowerLine(height * 0.7)
}

function draw() {
    background('#145ab5')
    
    // Update parameters from sliders
    params = {
        separationWeight: separationSlider.value(),
        cohesionWeight: cohesionSlider.value(),
        alignmentWeight: alignmentSlider.value(),
        maxSpeed: maxSpeedSlider.value(),
        detectionRadius: detectionRadiusSlider.value(),
        desiredSeparation: separationRadiusSlider.value(),
        energyDepletionRate: energyDepletionSlider.value()
    }

    // Update value displays
    select('#separationValue').html(params.separationWeight)
    select('#cohesionValue').html(params.cohesionWeight)
    select('#alignmentValue').html(params.alignmentWeight)
    select('#speedValue').html(params.maxSpeed)
    select('#detectionValue').html(params.detectionRadius)
    select('#separationRadValue').html(params.desiredSeparation)
    select('#energyValue').html(params.energyDepletionRate)

    // Draw power line
    powerLine.draw()

    flock.run()
}
    // yay 4 indentation

function keyPressed() {
    if (key === 'p' || key === 'P') {
        debugMode = true
    }
}

function keyReleased() {
    if (key === 'p' || key === 'P') {
        debugMode = false
    }
}

function resetValues() {
    separationSlider.value(DEFAULT_VALUES.separation)
    cohesionSlider.value(DEFAULT_VALUES.cohesion)
    alignmentSlider.value(DEFAULT_VALUES.alignment)
    maxSpeedSlider.value(DEFAULT_VALUES.speed)
    detectionRadiusSlider.value(DEFAULT_VALUES.detection)
    separationRadiusSlider.value(DEFAULT_VALUES.separationRad)
    energyDepletionSlider.value(DEFAULT_VALUES.energy)
}

