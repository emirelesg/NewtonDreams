// Constants
var Q_UNITS = 1e-6;
var Q1_CHARGE = 10;
var Q2_CHARGE = -7;
var RIGHT_E_FIELD = 1.5E8;
var ARROW_RANGE = 10;
var ARROW_STEP = 0.5;
var ARROW_HEAD_SIDE = 0.2;
var ARROW_BODY_LENGTH = 0.15;
var ARROW_BODY_HEIGHT = 0.05;
var HALF_ARROW_BODY_HEIGHT = ARROW_BODY_HEIGHT / 2;
var ARROW_LENGTH = ARROW_HEAD_SIDE * p$.SIN60 + ARROW_BODY_LENGTH;
var HALF_ARROW_LENGTH = ARROW_LENGTH / 2;
var ARROW_HEAD_X0 = HALF_ARROW_LENGTH - (ARROW_HEAD_SIDE * p$.SIN60) / 2;
var ARROW_BODY_X0 = -HALF_ARROW_LENGTH;

// Variables
var operation = "mixed";    // Current operation selected by the user.
var arrow_alpha = 0;        // Alpha of the arrow.
var calculate = false;      // Force to recalculate the forces.

// p$ Objects
var w;
var field = new p$.Shape(drawField, { angleStyle: p$.ANGLE_STYLE.RAD } );
var qs = new p$.Ball(0.4, { color: p$.COLORS.YELLOW, upperLabel: "+", lowerLabel: "Qs" });
var q1 = new p$.Ball(0.4, { display: false, color: p$.COLORS.RED, upperLabel: "+", lowerLabel: Q1_CHARGE + p$.SYMBOL.MICRO + "C" });
var q2 = new p$.Ball(0.4, { display: false, color: p$.COLORS.BLUE, upperLabel: "-", lowerLabel: Q2_CHARGE + p$.SYMBOL.MICRO + "C" });
var e = new p$.Vector();
var results = new p$.Box( { debug: false, color: p$.BOX_COLORS.YELLOW, isDraggable: false } );
var position = new p$.Box( {debug: false, isDraggable: false, color: p$.BOX_COLORS.GRAY } );var labels = {};
var vectors = {
  field: new p$.Vector(),
  arrow_field: new p$.Vector( { angleStyle: p$.ANGLE_STYLE.RAD } ),
  force: new p$.Vector({ components: true, scale: 1e-3, color: p$.COLORS.RED })
}
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
  w.axis.negative = false;
  w.scaleX.set(50, 1, "cm");
  w.scaleY.set(50, -1, "cm");

  // Enable Prerendering on field drawing.
  field.renderer.render();

  // Configure position box.
  labels.x = position.addLabel(50, 14, { name: "X:", decPlaces: 2, fixPlaces: true, labelWidth: 20 });
  labels.y = position.addLabel(50, 14, { name: "Y:", decPlaces: 2, fixPlaces: true, labelWidth: 20 });
  labels.x.setPosition(0, 0);
  labels.y.setPosition(60, 0);
  labels.x.set(3);
  labels.y.set(4);
  position.calculateDimensions();

  // Labels
  labels.force = results.addLabel(130, 14, { name: "Fuerza", units: "N", usePrefixes: true, labelWidth: 55, decPlaces: 1 });
  labels.field = results.addLabel(130, 14, { name: "Campo", units: "N/C", usePrefixes: true, labelWidth: 55, decPlaces: 1 });
  labels.field_angle = results.addLabel(130, 14, { name: p$.SYMBOL.THETA, units: "°", labelWidth: 55, decPlaces: 1 });
  labels.force.setPosition(0, 0);
  labels.field.setPosition(0, 25);
  labels.field_angle.setPosition(0, 50);
  results.calculateDimensions();

  // Set the initial position for the charges.
  q2.setPosition(7, 4);
  q1.setPosition(1, 1);
  qs.setPosition(3, 4);

  // Configure the z index of all objects.
  field.setZ(1);
  results.setZ(2);
  vectors.force.setZ(3);
  qs.setZ(4);
  q1.setZ(4);
  q2.setZ(4);
  position.setZ(5);

  // Add objects to world.
  w.add(qs, q1, q2, field, results, position);
  w.add(vectors.force);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.qs = new p$.Slider({ id: "q", start: 7, min: -10, max: 10, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset });

  // Configure field direction.
  controls.op = new p$.dom.Options("operation", function(o) {
    operation = o;
    
    // Update field drawing.
    field.renderer.render();

  });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {
  
  // Change color of particle, sliders, and force vector
  // depending on the charge of Qs.
  qs.setColor(getColor(controls.qs.value));
  qs.upperLabel = getSign(controls.qs.value);
  vectors.force.setColor(qs.color);
  controls.qs.setColor(qs.color);
  calculate = true;

}

/**
 * Draws a field of arrows.
 */
function drawField() {

  // Do not stroke arrows.
  field.noStroke();
  
  // Iterate through the field.
  for (var x = 0; x < 14; x += ARROW_STEP) {
    for (var y = 0; y < 8; y += ARROW_STEP) {

      var k = 20;
      
      // Calculate the field at coordinates (x, y).
      switch (operation) {
        case "left":
          vectors.arrow_field.setMag(RIGHT_E_FIELD, p$.PI);
          break;
        case "right":
          vectors.arrow_field.setMag(RIGHT_E_FIELD, 0);
          break;
        default:
          var f1 = calculateField(q1.position, {x: x, y: y}, Q1_CHARGE * Q_UNITS);
          var f2 = calculateField(q2.position, {x: x, y: y}, Q2_CHARGE * Q_UNITS);
          k = effectOnPoint(f1, Q1_CHARGE) + effectOnPoint(f2, Q2_CHARGE);
          vectors.arrow_field.set(f1);
          vectors.arrow_field.add(f2);
      }
      
      // Draw arrow field.
      field.fill(fieldColor(k));
      drawArrow(field, x, y, vectors.arrow_field.angle());

    }
  }

  ;
  // Redraw.
  calculate = true;

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Update elements if the user is dragging something or flag is set.
  if (w.mouse.dragging !== p$.DRAG_NOTHING || calculate) {
    
    // Change the position box labels to sensor charge.
    labels.x.set(qs.position.x);
    labels.y.set(qs.position.y);

    // Calculate field with respect to Qs.
    switch (operation) {
      case "left": case "right":
        vectors.field.set(vectors.arrow_field);
        break;
      default:
        vectors.field.set(calculateField(q1.position, qs.position, Q1_CHARGE * Q_UNITS));
        vectors.field.add(calculateField(q2.position, qs.position, Q2_CHARGE * Q_UNITS));
    }

    // Calculate force with respect to Qs.
    vectors.force.set(vectors.field);
    vectors.force.mult(controls.qs.value * Q_UNITS, controls.qs.value * Q_UNITS);

    // Set the labels of the results box.
    labels.force.set(vectors.force.mag());
    labels.field.set(vectors.field.mag());
    labels.field_angle.set(vectors.field.angle());

    // Set the positions of the results box and vectors.
    results.setPosition(qs.position.x * w.scaleX.toPx + w.axis.position.x - results.width / 2, qs.position.y * w.scaleY.toPx + w.axis.position.y + 30);
    vectors.force.setPosition(qs.position.x, qs.position.y);

    // Reset flag.
    calculate = false;

  }

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(50, w.height - 50);
  position.setPosition(w.width - position.width - 20, 20);
}
