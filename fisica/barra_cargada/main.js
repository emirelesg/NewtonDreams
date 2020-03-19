// Constants
var BAR_HEIGHT = 4;         // Height of the bar in cm.
var BAR_WIDTH = 0.4;        // Width of the bar centered around the y axis in cm.

// Variables
var bar_charge = "+";       // Sign of the charge. Can be +,-, or nothing.
var lambda = 0;             // Value of the slider in Coulombs.
var is_inside = false;      // Is the mouse currently inside of the bar?
var was_inside = false;     // Previous state of the variable is_inside.

// p$ Objects
var w;
var position = new p$.Box( {debug: false, isDraggable: false, color: p$.BOX_COLORS.GRAY } );
var results = new p$.Box( { debug: false, title: "Resultados", display: true, isDraggable: false } );
var particle = new p$.Ball(0.25, { color: p$.COLORS.PURPLE, topmostOnDrag: false, onMouseMove: particleMoved } );
var bar = new p$.Shape(drawBar, {} );
var field = new p$.Vector( { scale: 0.001, components: true, color: p$.COLORS.PURPLE } );
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
  w.axis.isDraggable = false;
  w.scaleX.unit = "cm";
  w.scaleY.unit = "cm";

  // Configure results box
  var LABEL_WIDTH = 60;
  labels.e = results.addLabel(130, 14, { name: "Campo", units: "N/C", labelWidth: LABEL_WIDTH, decPlaces: 0 } );
  labels.e.setPosition(0, 25);
  labels.angle = results.addLabel(130, 14, { name: p$.SYMBOL.THETA, units: "°", labelWidth: LABEL_WIDTH, decPlaces: 0 } );
  labels.angle.setPosition(0,50);
  results.calculateDimensions();

  // Configure position box.
  labels.x = position.addLabel(50, 14, { name: "X:", decPlaces: 2, fixPlaces: true, labelWidth: 20, onClick: function() {setPosition('x')} });
  labels.y = position.addLabel(50, 14, { name: "Y:", decPlaces: 2, fixPlaces: true, labelWidth: 20, onClick: function() {setPosition('y')} });
  labels.x.setPosition(0, 0);
  labels.y.setPosition(60, 0);
  position.calculateDimensions();

  // Configure objects
  particle.setPosition(1, 4);

  // Configure the z index of all objects.
  bar.setZ(1);
  field.setZ(2);
  position.setZ(10);
  results.setZ(11);
  particle.setZ(12);
  
  // Add objects to world.
  w.add(particle, bar, field, results, position);

}

/**
 * Called when the -x or -y label is clicked.
 * Asks the user for a new component.
 */
function setPosition(component) {
  var raw = prompt('Posición -' + component + ":", labels[component].value);
  var num = parseFloat(raw);
  if (!isNaN(num)) {
    particle.position[component] = num;
    particleMoved();
  }
}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.lambda = new p$.Slider({ id: "density", start: 2, min: -10, max: 10, decPlaces: 1, units: "nC/m", callback: reset });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Get controls variable
  lambda = controls.lambda.value * 1E-9;

  // Change colors and signs depending on charge.
  if (lambda > 0) {
    bar_charge = "+";
  } else if (lambda < 0) {
    bar_charge = "-";
  } else {
    bar_charge = "";
  }

}

/**
 * Function to draw the charged bar.
 */
function drawBar() {

  // Select color of the bar.
  switch (bar_charge) {
    case "+":
      bar.stroke(p$.BOX_COLORS.RED.BORDER);
      bar.fill(p$.BOX_COLORS.RED.BACKGROUND);
      break;
    case "-":
      bar.stroke(p$.BOX_COLORS.BLUE.BORDER);
      bar.fill(p$.BOX_COLORS.BLUE.BACKGROUND);
      break;
    default:
      bar.stroke(p$.BOX_COLORS.GRAY.BORDER);
      bar.fill(p$.BOX_COLORS.GRAY.BACKGROUND);
  }
  
  // Draw bar rectangle.
  bar.rect(-BAR_WIDTH/2, 0, BAR_WIDTH, BAR_HEIGHT);
  
  // Draw the signs of the bar
  if (bar_charge !== "") {
    bar.strokeWeight(2);
    var step = BAR_HEIGHT / 13;
    for (var h = step; h < BAR_HEIGHT -step; h += step) {
      bar.line(-0.06, h, 0.06, h)
      if (bar_charge === "+") {
        bar.line(0, h - 0.06, 0, h + 0.06);
      }
    }
  }


}

/**
 * Function called after the particle is moved. 
 * Prevents it from going inside of the charged bar.
 * Calculates the resultant field on the particle.
 */
function particleMoved() {
  
  // Determine if the mouse is inside of the charged bar.
  is_inside = Math.abs(w.mouse.rx) < BAR_WIDTH/2 + particle.r && w.mouse.ry < BAR_HEIGHT + particle.r && w.mouse.ry > -particle.r/2;
  
  // Change the position of the ball if it is inside the bar.
  if (is_inside) {
    var new_x = BAR_WIDTH / 2 + particle.r;
    particle.setPosition((w.mouse.rx > 0 ? new_x : -new_x), w.mouse.ry);
  } else if (was_inside) {
    particle.setPosition(w.mouse.rx, w.mouse.ry);
  }

  // Save the previous state.
  was_inside = is_inside;

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Calculate field
  var l = BAR_HEIGHT * p$.CM_TO_M;
  var xp = (p$.utils.round(particle.position.x, 6) || 0) * p$.CM_TO_M;
  var yp = (p$.utils.round(particle.position.y, 6) || 0) * p$.CM_TO_M;
  var xp_sq = xp * xp;
  var yp_sq = yp * yp;
  var k = 9E9;
  var r = Math.sqrt(xp_sq + yp_sq);
  var ey1, ey2, ey;

  // Calculate field in the x direction
  ex1 = k * lambda * xp * (yp / (xp_sq * r)) || 0;
  ex2 = k * lambda * xp * ((l-yp)/(xp_sq * Math.sqrt(l*l - 2*l*yp + xp_sq + yp_sq))) || 0;
  ex = ex1 + ex2;

  // Calculate field in the y direction
  if (xp != 0) {
    // When the particle is anywhere but above or below the bar
    ey1 = k * lambda * (1/Math.abs(xp) - 1/r) || 0;
    ey2 = k * lambda * (1/Math.abs(xp) - 1/Math.sqrt(l*l - 2*l*yp + xp_sq + yp_sq)) || 0;
    ey = ey1 - ey2;
  } else {
    ey = k * lambda * (-1/(l-yp)-1/yp);
    if (yp < 0) ey *= -1;
  }

  // Move field vector to particle position
  field.setPosition(particle.position.x, particle.position.y);

  // Set field vector
  field.set(ex, ey);

  // Set result labels
  labels.e.set(field.mag());
  labels.angle.set(field.angle());

  // Set position labels
  labels.x.set(particle.position.x);
  labels.y.set(particle.position.y);

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height - 50);
  results.setPosition(20, 20);
  position.setPosition(w.width - position.width - 20, 20);
}
