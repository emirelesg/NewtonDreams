// Constants
var VECTOR_AMOUNT = 8;          // Amount of vectors around the gaussian sphere.
var R = 10;                     // Radius of the charged sphere.

// Variables
var radius = 0;                 // Radius of the gaussian sphere in cm.
var charge = 0;                 // Charge of the particle in uC.
var e = 0;                      // Electric field.

// p$ Objects
var w;
var results = new p$.Box( {debug: false, isDraggable: false, title: "Resultados" } );
var particle = new p$.Ball(R, { isDraggable: false, color: p$.COLORS.RED } );
var gauss = new p$.Shape(drawGauss);
var r_particle = new p$.Vector( { color: p$.COLORS.GRAY } );
var r_gauss = new p$.Vector( { color: p$.COLORS.GRAY } );
var vectors = [];
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
  w.axis.display = false;
  w.scaleX.set(50, 6, "");
  w.scaleY.set(50, -6, "");

  // Configure result box.
  labels.qenc = results.addLabel(170, 14, { name: "Qenc", units: p$.SYMBOL.MICRO + "C", labelWidth: 60, decPlaces: 1 })
  labels.qenc.setPosition(0, 25);
  labels.e = results.addLabel(170, 14, { name: "Campo", units: "kN/C", labelWidth: 60, decPlaces: 0 })
  labels.e.setPosition(0, 50);
  labels.flux = results.addLabel(170, 14, { name: "Flux", units: "kNm²/C", labelWidth: 60, decPlaces: 0 })
  labels.flux.setPosition(0, 75);
  results.calculateDimensions();

  // Create vectors used to display field around the gaussian sphere.
  r_particle.set(R, 0);
  for (var i = 0; i < VECTOR_AMOUNT; i += 1) {
    var v = new p$.Vector( { display: false, color: p$.COLORS.BROWN } );
    v.setZ(5);
    vectors.push(v);
    w.add(v);
  }

  // Configure the z index of all objects.
  particle.setZ(1);
  gauss.setZ(2);
  r_particle.setZ(3);
  r_gauss.setZ(4);
  results.setZ(5);

  // Add objects to world.
  w.add(particle, gauss, r_particle, r_gauss, results);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.charge = new p$.Slider({ id: "charge", start: 10, min: -15, max: 15, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset, color: p$.COLORS.RED });
  controls.radius = new p$.Slider({ id: "radius", start: 15, min: 0, max: 20, decPlaces: 1, units: "cm", callback: reset, color: p$.COLORS.GREEN });

  // Toggle field view.
  controls.view_field = new p$.dom.Option("showField", function(c) {
    for (var i = 0; i < vectors.length; i++) {
      vectors[i].display = c;
    }
  });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Get value of sliders.
  radius = controls.radius.value;
  charge = controls.charge.value * 1E-6;
  var charge_r = R * p$.CM_TO_M;
  var gauss_r = radius * p$.CM_TO_M;

  // Calculate qenc in C
  var p = charge / (4 / 3 * p$.PI * Math.pow(charge_r, 3));
  var qenc = gauss_r < charge_r ? p * (4 / 3 * p$.PI * Math.pow(gauss_r, 3)) : charge;
  e = qenc / (p$.E0 * 4 * p$.PI * Math.pow(gauss_r, 2));  // N/C
  e = e / 1000 || 0; // kN/C
  var flux = (qenc / p$.E0) / 1000; // kNm^2/C
  qenc = qenc / 1E-6; // uC

  // Set labels
  labels.e.set(e);
  labels.flux.set(flux);
  labels.qenc.set(qenc);
  
  // Update gauss radius vector.
  r_gauss.set(radius * p$.utils.cos(45, p$.ANGLE_STYLE.DEG), radius * p$.utils.sin(-45, p$.ANGLE_STYLE.DEG));

  // Draw vectors around the sphere.
  var s = 360 / vectors.length;
  for (var i = 0; i < vectors.length; i += 1) {
    vectors[i].setPosition(radius * p$.utils.cos(i * s, p$.ANGLE_STYLE.DEG), radius * p$.utils.sin(i * s, p$.ANGLE_STYLE.DEG));
    vectors[i].setMag(e / 1000, i * 45);
  }

  // Change the color of the charge.
  if (charge > 0) {
    particle.color = p$.COLORS.RED;
  } else if (charge < 0) {
    particle.color = p$.COLORS.BLUE;
  } else {
    particle.color = p$.COLORS.GRAY;
  }

  // Change the color of the slider.
  controls.charge.setColor(particle.color);

}

/**
 * Draw Gaussian Sphere.
 */
function drawGauss() {

  // Draw gaussian sphere.
  gauss.noFill();
  gauss.stroke(p$.COLORS.GRAY);
  gauss.lineDash(10);
  gauss.strokeWeight(2);
  gauss.arc(0, 0, radius, 0, 360);
  
  // Draw the radius of the particle
  gauss.font.set({ color: p$.COLORS.GRAY, size: 16 });
  gauss.text(R + " cm", R / 2, 2);

  // Draw labels if radius is big enough
  if (radius > 2) {
    
    // Draw the radius of the gauss circle
    // Calculate the position of the label so that it is 2 units above the line
    var beta = Math.atan(3 / (radius / 2));
    var x = radius * 0.5 * Math.cos(beta + 45 * p$.DEG_TO_RAD);
    var y = radius * 0.5 * Math.sin(-beta - 45 * p$.DEG_TO_RAD);
    gauss.text("r", x, y);

    // Draw label for the field
    if (e !== 0 && vectors[1].display) {
      var offset = e > 0 ? 1.5 : -1.5;
      gauss.font.set({ color: p$.COLORS.BROWN });
      gauss.text("E", vectors[1].position.x + vectors[1].x + offset, vectors[1].position.y + vectors[1].y + offset);
    }

  }

}

/**
 * Function gets called 60x per second.
 */
function draw() {

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
  results.setPosition(20, 20);
}
