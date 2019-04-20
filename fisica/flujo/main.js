// Constants
var LENGTH = 15;                              // Length of the pipe
var JOINT_H = 4;                              // Length of the joint between pipes
var JOINT_START = (LENGTH-JOINT_H)/2;         // Start position of the joint
var JOINT_END = JOINT_START + JOINT_H;        // End position of the joint
var PIPE_L = LENGTH - JOINT_END;              // Length of a pipe
var MAX_POINTS = 150;                         // Maximum amount of points.

// Variables
var r1, r2;                                   // Hold radius variables from sliders
var v1 = 0;                                   // Velocity on pipe 1.
var v2 = 0;                                   // Velocity on pipe 2.
var p_diff = 0;                               // Pressure difference between both pipes.
var ry = 0.75;                                // Radius in y of the ellipses
var points = [];                              // Holds all of the 2d arrays with points.
var point_r = 0;                              // Radius of the points, depends on the density.

// p$ Objects
var w;
var results = new p$.Box( { debug: false, isDraggable: false, title: "Resultados" } );
var pipe = new p$.Shape(drawPipe);
var particles = new p$.Shape(drawParticles);
var controls = {};
var labels = {};

/**
 * Function runs when document is completely loaded.
 */
$(function() {
  setup();
  setupControls();
  reset();
  w.start();
});

/**
 * Initialize world and set up other objects.
 */
function setup() {
  
  // Configure the world.
  w = new p$.World("canvasContainer", draw, resize);
  w.color = p$.BOX_COLORS.GRAY.BACKGROUND;
  w.scaleX.set(50, 2, "m");
  w.scaleY.set(50, -1, "m");
  w.axis.isDraggable = false;
  w.axis.display = false;

  // Enable prerendering on the pipe.
  this.pipe.renderer.render();

  // Configure result labels.
  labels.v1 = results.addLabel(130, 14, {name: "V1", units: "m/s", decPlaces: 2, labelWidth: 60 } );
  labels.v1.setPosition(0, 25);
  labels.v2 = results.addLabel(130, 14, {name: "V2", units: "m/s", decPlaces: 2, labelWidth: 60 } );
  labels.v2.setPosition(0, 50);
  labels.p_diff = results.addLabel(130, 14, {name: "P2 - P1", units: "Pa", usePrefixes: true, decPlaces: 1, labelWidth: 60 } );
  labels.p_diff.setPosition(0, 75);
  results.calculateDimensions();
 
  // Spawn points at random position.
  for (var i = 0; i < MAX_POINTS; i++) {
    points.push({
      x: LENGTH * Math.random(),
      y: 0,
      line: Math.floor(Math.random() * 9)
    })
  }

  // Configure the z index of all objects.
  pipe.setZ(1);
  particles.setZ(2);
  results.setZ(3);

  // Add objects to world.
  w.add(pipe, particles, results);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.flow = new p$.Slider({ id: "flow", start: 4, min: 1, max: 10, decPlaces: 2, units: "m³/s", callback: reset, color: p$.COLORS.RED });
  controls.density = new p$.Slider({ id: "density", start: 1000, min: 1, max: 2000, decPlaces: 0, units: "kg/m³", callback: reset, color: p$.COLORS.GREEN });
  controls.d1 = new p$.Slider({ id: "d1", start: 4, min: 1.5, max: 5, decPlaces: 2, units: "m", callback: reset, color: p$.COLORS.BLUE });
  controls.d2 = new p$.Slider({ id: "d2", start: 2, min: 1.5, max: 5, decPlaces: 2, units: "m", callback: reset, color: p$.COLORS.YELLOW });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Get value from sliders.
  r1 = controls.d1.value / 2;
  r2 = controls.d2.value / 2;
  point_r = 0.1 * controls.density.value / 2000 + 0.05;

  // Calculate values for labels.
  v1 = controls.flow.value/(p$.PI*r1*r1);                     // Speed on pipe 1
  v2 = controls.flow.value/(p$.PI*r2*r2);                     // Speed on pipe 2
  p_diff = controls.density.value * (v1*v1 - v2*v2) / 2;      // Pressure diference
  labels.v1.set(v1);
  labels.v2.set(v2);
  labels.p_diff.set(p_diff);

  // Redraw pipe.
  pipe.renderer.render();

}

/**
 * Draw pipe with flow rate lines.
 */
function drawPipe() {

  // Line weight.
  pipe.strokeWeight(2);

  // Draw pipe labels.
  pipe.font.set({ size: 16 });
  pipe.text("1", JOINT_START / 2, - r1 - 0.5);
  pipe.text("2", (LENGTH + JOINT_END) / 2, - r2 - 0.5);
  
  // Draw flow lines outside pipe.
  pipe.stroke(p$.BOX_COLORS.BLUE.BORDER);
  for (var i = -4; i < 5; i += 1) {
    h1 = i * r1 / 5;
    h2 = i * r2 / 5;
    pipe.line(-10, h1, 0, h1);
    pipe.line(LENGTH+10, h2, LENGTH, h2);
  }
  
  // Draw main ellipses.
  pipe.fill("#ccc");
  pipe.stroke("#777");
  pipe.ellipse(0, 0, ry, r1, 0, 360);
  pipe.ellipse(LENGTH, 0, ry, r2, 0, 360);

  // Draw fake ellipses.
  pipe.stroke("#ccc");
  pipe.noFill();
  pipe.ellipse(JOINT_START, 0, ry, r1, 0, 360);
  pipe.ellipse(JOINT_END, 0, ry, r2, 0, 360);

  // Draw lines to connect the ellipses.
  pipe.stroke("#777");
  pipe.line(0, r1, JOINT_START, r1);
  pipe.line(0, -r1, JOINT_START, -r1);
  pipe.line(JOINT_START, r1, JOINT_END, r2);
  pipe.line(JOINT_START, -r1, JOINT_END, -r2);
  pipe.line(JOINT_END, r2, LENGTH, r2);
  pipe.line(JOINT_END, -r2, LENGTH, -r2);

  // Draw flow lines inside of the pipe.
  pipe.stroke(p$.BOX_COLORS.BLUE.BORDER);
  for (var i = -4; i < 5; i += 1) {
    h1 = i * r1 / 5;
    h2 = i * r2 / 5;
    pipe.line(0, h1, JOINT_START, h1);
    pipe.line(JOINT_START, h1, JOINT_END, h2);
    pipe.line(JOINT_END, h2, LENGTH, h2);
  }

}

/**
 * Draws all flow particles inside of the pipe.
 */
function drawParticles() {

  particles.fill(p$.COLORS.BLUE);
  particles.noStroke();
  for (var i = 0; i < points.length; i++) {
    if (points[i].x >= 0) {
      particles.arc(points[i].x, points[i].y, point_r, 0, 360);
    }
  }

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Move particles through the pipe.
  // When they reach the end respawn them at the beginning
  // of the pipe with a new height.
  for (var i = 0; i < points.length; i++) {

    // Height of the particle depending on the line.
    var h1 = (points[i].line - 4) * r1 / 5;
    var h2 = (points[i].line - 4) * r2 / 5;
    
    // Change speed and height of the particle depending on the portion of pipe.
    var v = 0;
    var h = 0;
    if (points[i].x < JOINT_START) {
      v = v1;
      h = h1;
    } else if (points[i].x < JOINT_END) {
      v = v1 + (v2 - v1) / (JOINT_END - JOINT_START) * (points[i].x - JOINT_START); 
      h = h1 + (h2 - h1) / (JOINT_END - JOINT_START) * (points[i].x - JOINT_START);
    } else {
      v = v2;
      h = h2;
    }

    // Calculate new position and height.
    points[i].x += v / 10;
    points[i].y = h;
    
    // Point at the end of the pipe.
    // Recalculate all properties at random.
    if (points[i].x > LENGTH) {
      points[i].x = -3 * Math.random();
      points[i].line = Math.floor(Math.random() * 9);
      points[i].y = (points[i].line - 4) * r1 / 5;
    }
  }

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  if (w.width < 400) {
    w.scaleX.set(50, 3, "m");
    w.axis.setPosition(Math.floor(w.width / 2 - 50 * LENGTH / 6), w.height / 2 + 20);
  } else {
    w.scaleX.set(50, 2, "m");
    w.axis.setPosition(Math.floor(w.width / 2 - 50 * LENGTH / 4), w.height / 2 + 20);  
  }
  results.setPosition(20, 20);
}