// Constants
var ROD_HEIGHT = 4;         // Height of the bar in cm.
var ROD_WIDTH = 0.4;        // Width of the bar centered around the y axis in cm.
var K = 9E9;

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
var field = new p$.Vector( { scale: 0.01, components: true, color: p$.COLORS.PURPLE } );
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
  labels.e = results.addLabel(130, 14, { name: "Campo", units: "N/C", labelWidth: LABEL_WIDTH, decPlaces: 1 } );
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
  particle.setPosition(3, 0);

  // Configure the z index of all objects.
  bar.setZ(1);
  field.setZ(2);
  position.setZ(10);
  particle.setZ(11);
  results.setZ(12);
  
  // Add objects to world.
  w.add(particle, bar, field, results, position);

}

/**
 * Called when the -x or -y label is clicked.
 * Asks the user for a new component.
 */
function setPosition(component) {
  var raw = prompt('Posición -' + component + ":", labels[component].value.trim());
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
}

/**
 * Function to draw the charged bar.
 */
function drawBar() {

  // // Select color of the bar.
  // var color = 'GRAY';
  // if (bar_charge === '+') color = 'RED';
  // if (bar_charge === '-') color = 'BLUE';

  // // Draw bar rectangle.
  // bar.save();
  // bar.translate(0, -BAR_HEIGHT / 2);
  // bar.stroke(p$.BOX_COLORS[color].BORDER);
  // bar.fill(p$.BOX_COLORS[color].BACKGROUND);
  // bar.strokeWeight(2);
  // bar.rect(-BAR_WIDTH/2, 0, BAR_WIDTH, BAR_HEIGHT);  
  // if (lambda !== 0) {
  //   var step = BAR_HEIGHT / 13;
  //   for (var h = step; h < BAR_HEIGHT -step; h += step) {
  //     bar.line(-0.06, h, 0.06, h)
  //     if (bar_charge === "+") {
  //       bar.line(0, h - 0.06, 0, h + 0.06);
  //     }
  //   }
  // }
  // bar.restore();





  var nSteps = 10;                   // Amount of integration sections.
  var step = ROD_HEIGHT / nSteps;   // Length of the integration section.
  var halfLength = ROD_HEIGHT / 2;  // Positive half of the rod.
  var x = particle.position.x;      // -x position of the particle.
  var y = particle.position.y;      // -y position of the particle.
  var halfRodWidth = ROD_WIDTH / 2;
  var halfRodHeight = ROD_HEIGHT / 2;

  field.set(0, 0);

  // Draw complete rod.
  bar.stroke('black');
  bar.noFill();
  bar.rect(-halfRodWidth, -halfRodHeight, ROD_WIDTH, ROD_HEIGHT);  

  // // Draw sections inside rod.
  // bar.fill('yellow');
  // bar.stroke('black');
  // bar.font.set({ color: 'red'})
  // for (var i = 0; i < nSteps ; i++) {

  //   var y0 = -halfLength + step * i;
  //   var yMiddle = y0 + step / 2;

  //   var lambda = (controls.lambda.value * 1E-9);
  //   var chargeOnSlice =  lambda * step * p$.CM_TO_M;

  //   var dx = (x - 0) * p$.CM_TO_M;
  //   var dy = (y - yMiddle) * p$.CM_TO_M;

  //   var rSquared = dx * dx + dy * dy;
  //   var dE = K * chargeOnSlice / rSquared;
    
  //   var dEAngle = Math.atan2(dy, dx);

  //   var dEx = dE * Math.cos(dEAngle);
  //   var dEy = dE * Math.sin(dEAngle);
  //   field.add(dEx, dEy)

  //   bar.rect(-halfRodWidth * 0.5, y0, ROD_WIDTH * 0.5, step)
  //   bar.line(x, y, 0, yMiddle);
  //   bar.text(p$.utils.round(dEAngle * p$.RAD_TO_DEG, 1), -3, yMiddle);
  //   bar.text(p$.utils.round(dEx, 1), -5, yMiddle);
  //   bar.text(p$.utils.round(dEy, 1), -4, yMiddle);
  // }

  // bar.text(p$.utils.round(field.x, 1), -5, -halfRodHeight - 0.5);
  // bar.text(p$.utils.round(field.y, 1), -4, -halfRodHeight - 0.5);
  // bar.text(p$.utils.round(Math.sqrt(field.x ** 2 + field.y ** 2), 1), -6, -halfRodHeight - 0.5);


  // https://www.usna.edu/Users/physics/mungan/_files/documents/Scholarship/RodElectricField.pdf
  // Page 2 - http://www.phys.uri.edu/gerhard/PHY204/tsl31.pdf
  // Calculate R
  var R = x * p$.CM_TO_M;
  bar.stroke('orange');
  bar.line(0, y, x, y);
  bar.font.set({color: 'orange'});
  bar.text(p$.utils.round(R, 3), x / 2, y + 0.1);

  // Calculate thetaL
  var thetaL = Math.atan2((halfRodHeight - y), x);
  bar.stroke('red');
  bar.line(0, halfRodHeight, x, y);
  bar.font.set({color: 'red'});
  bar.text(p$.utils.round(halfRodHeight-y, 1), 0, y + 0.2);
  bar.text(p$.utils.round(thetaL * p$.RAD_TO_DEG, 1), x, y + 0.5);

  // Calculate thetaR
  var thetaR = Math.atan2((-halfRodHeight - y), x);
  bar.stroke('green');
  bar.line(0, -halfRodHeight, x, y);
  bar.font.set({color: 'green'});
  bar.text(p$.utils.round(-halfRodHeight-y, 1), 0, y - 0.2);
  bar.text(p$.utils.round(thetaR * p$.RAD_TO_DEG, 1), x, y - 0.5);
  
  var lambda = (controls.lambda.value * 1E-9);
  field.set(
    K * lambda * (Math.sin(thetaR) - Math.sin(thetaL)) / R,
    K * lambda * (Math.cos(thetaR) - Math.cos(thetaL)) / R
  )


}

/**
 * Function called after the particle is moved. 
 * Prevents it from going inside of the charged bar.
 * Calculates the resultant field on the particle.
 */
function particleMoved() {
  
  // // Determine if the mouse is inside of the charged bar.
  // is_inside = Math.abs(w.mouse.rx) < ROD_WIDTH/2 + particle.r && w.mouse.ry < ROD_HEIGHT + particle.r && w.mouse.ry > -particle.r/2;
  
  // // Change the position of the ball if it is inside the bar.
  // if (is_inside) {
  //   var new_x = ROD_WIDTH / 2 + particle.r;
  //   particle.setPosition((w.mouse.rx > 0 ? new_x : -new_x), w.mouse.ry);
  // } else if (was_inside) {
  //   particle.setPosition(w.mouse.rx, w.mouse.ry);
  // }

  // // Save the previous state.
  // was_inside = is_inside;

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Move field vector to particle position
  field.setPosition(particle.position.x, particle.position.y);

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
  w.axis.setPosition(w.width / 2, w.height / 2);
  results.setPosition(20, 20);
  position.setPosition(w.width - position.width - 20, 20);
}
