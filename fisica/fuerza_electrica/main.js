// Constants
var Q_UNITS = 1E-6;         // All charges are in uC.
var FORCE_SCALE = 1/150;    // Scale factor for displaying the force vector.

// Variables
var calculate = false;      // Force to recalculate the forces.
var prevChargeDragged = 0;  // Index of the previous charge being dragged.
var visibleCharges = 2;     // Amount of charges being displayed.

// p$ Objects
var activeQ;                // Currently selected charge.
var w;
// var field = new p$.Shape(drawField, { angleStyle: p$.ANGLE_STYLE.RAD } );
var results = new p$.Box( { debug: false, color: p$.BOX_COLORS.YELLOW, isDraggable: false } );
var position = new p$.Box( {debug: false, isDraggable: false, color: p$.BOX_COLORS.GRAY } );
var charges = [];
var vectors = {
  force: new p$.Vector( { scale: FORCE_SCALE, components: true }),
  temp_force: new p$.Vector( { angleStyle: p$.ANGLE_STYLE.RAD } ),
  field: new p$.Vector( { angleStyle: p$.ANGLE_STYLE.RAD } )
};
var labels = {};
var controls = {};

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
  w.axis.negative = false;
  w.axis.isDraggable = false;
  w.scaleX.set(50, 1, "cm");
  w.scaleY.set(50, -1, "cm");

  // Configure position box.
  labels.x = position.addLabel(50, 14, { name: "X:", decPlaces: 2, fixPlaces: true, labelWidth: 20, onClick: function() {setPosition('x')} });
  labels.y = position.addLabel(50, 14, { name: "Y:", decPlaces: 2, fixPlaces: true, labelWidth: 20, onClick: function() {setPosition('y')} });
  labels.x.setPosition(0, 0);
  labels.y.setPosition(60, 0);
  position.calculateDimensions();

  // Labels
  labels.force = results.addLabel(80, 14, { name: "F", units: "N", usePrefixes: true, labelWidth: 20, decPlaces: 1 });
  labels.angle = results.addLabel(80, 14, { name: p$.SYMBOL.THETA, units: "°", labelWidth: 20, decPlaces: 0 });
  labels.force.setPosition(0, 0);
  labels.angle.setPosition(0, 25);
  results.calculateDimensions();

  // Activate prerendering.
  // field.renderer.render();

  // Create the five charges.
  for (var i = 0; i < 5; i++) {
    var c = new p$.Ball(0.4, { lowerLabel: "Q" + (i + 1) } );
    c.display = i < 2;
    c.setZ(4);
    w.add(c);
    charges.push(c);
  }
  charges[0].setPosition(4, 5);
  charges[1].setPosition(1, 1);

  // Configure the z index of all objects.
  // field.setZ(1);
  results.setZ(2);
  vectors.force.setZ(3);
  position.setZ(10);

  // Add objects to world.
  w.add(results, position, vectors.force);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.q = [
    new p$.Slider({ id: "q1", start: 5, min: -10, max: 10, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset }),
    new p$.Slider({ id: "q2", start: -5, min: -10, max: 10, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset }),
    new p$.Slider({ id: "q3", start: 0, min: -10, max: 10, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset }),
    new p$.Slider({ id: "q4", start: 0, min: -10, max: 10, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset }),
    new p$.Slider({ id: "q5", start: 0, min: -10, max: 10, decPlaces: 1, units: p$.SYMBOL.MICRO + "C", callback: reset }),
  ]

  // Add charge button.
  controls.add = new p$.dom.Button("addCharge", function() {
    
    // Add only if the amount is >= 2 and < 5.
    if (visibleCharges >= 2 && visibleCharges < 5) {

      // Increment the amount of visible charges.
      visibleCharges += 1;

      // Make slider visible.
      var tr = document.getElementById("q" + visibleCharges);
      tr.style.display = "";

      // Update controls and charges.
      var i = visibleCharges - 1;
      controls.q[i].set(0);
      charges[i].setPosition((i - 2) * 1.5 + 1, 5);
      charges[i].display = true;

      // Enable remove button.
      controls.remove.enabled(true);

    }
    if (visibleCharges === 5) this.enabled(false);
  });

  // Remove charge button.
  controls.remove = new p$.dom.Button("removeCharge", function() {
    if (visibleCharges > 2 && visibleCharges <= 5) {

      // Hide slider.
      var tr = document.getElementById("q" + visibleCharges);
      tr.style.display = "none";

      // Update charges.
      var i = visibleCharges - 1;
      prevChargeDragged = prevChargeDragged === i ? i - 1 : prevChargeDragged;
      charges[i].display = false;
      visibleCharges -= 1;
      
      // Enable add button.
      controls.add.enabled(true);

      // Update the calculations.
      calculate = true;

    }
    if (visibleCharges === 2) controls.remove.enabled(false)
  });
  controls.remove.enabled(false);
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Update the color, sign and charge of all charges.
  for (var i = 0; i < charges.length; i++) {
    charges[i].setColor(p$.Ball.getChargeColor(controls.q[i].value));
    charges[i].upperLabel = p$.Ball.getChargeSign(controls.q[i].value);
    controls.q[i].setColor(charges[i].color);
  }

  // Request an update to calculations.
  calculate = true;

}

/**
 * Called when the -x or -y label is clicked.
 * Asks the user for a new component.
 */
function setPosition(component) {

  if (activeQ) {
    var raw = prompt("Posición -" + component + " de " + activeQ.lowerLabel +":", labels[component].value.trim());
    var num = parseFloat(raw);
    if (!isNaN(num)) {
      activeQ.position[component] = num;
      calculate = true;
    }
  }
    
}


/**
 * Function used to draw the electric field.
 */
// function drawField() {
//   field.noStroke();
//   for (var x = 0; x < 14; x += 0.5) {
//     for (var y = 0; y < 8; y += 0.5) {

//       // Variable kees a record of how much influence a particle has on a point.
//       // The more negative it becomes the more negative charges affect the point
//       // and viceversa.
//       var k = 0;

//       // Reset the field vector.
//       vectors.field.set(0, 0);
//       for (var i = 0; i < visibleCharges; i += 1) {

//         // Calculate the field on the coordinates x, y caused by charge i.
//         var f = calculateField(charges[i].position, {x: x, y: y}, controls.q[i].value * Q_UNITS)
//         vectors.field.add(f);
        
//         // Calculate the effect caused by charge i.
//         k += effectOnPoint(f, controls.q[i].value);
        
//       }

//       // Obtain field color and draw arrow.
//       field.fill(fieldColor(k));
//       drawArrow(field, x, y, vectors.field.angle());

//     }
//   }


// }

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Set position of the object dragged to box.
  if (w.mouse.dragging != p$.DRAG_NOTHING || calculate) {

    // Use the currently charge being dragged or the last charge that
    // was dragged.
    activeQ = calculate ? charges[prevChargeDragged] : w.mouse.dragging;
  
    // Disable flag and get the index of the selected charge q.
    calculate = false;
    prevChargeDragged = charges.indexOf(activeQ);
    
    // Get the charge from the sliders.
    var q_charge = controls.q[prevChargeDragged].value * Q_UNITS;

    // Calculate the force vector. Start by reseting it.
    vectors.force.set(0, 0);
    for (var i  = 0; i < charges.length; i++) {
      
      // Iterate through every other charge in the array.
      // Calculate force and add result to force vector to get resultant.
      if (charges[i] !== activeQ && charges[i].display) {
        var dx = (activeQ.position.x - charges[i].position.x) * p$.CM_TO_M;
        var dy = (activeQ.position.y - charges[i].position.y) * p$.CM_TO_M;
        vectors.temp_force.setMag(
          Math.round((p$.K * (controls.q[i].value * Q_UNITS) * q_charge) / (dx * dx + dy * dy), 1),
          Math.atan2(dy, dx)
        );
        vectors.force.add(vectors.temp_force);
      }
    }
 
    // Set position and results labels.
    labels.force.set(vectors.force.mag());
    labels.angle.set(vectors.force.angle());
    labels.x.set(activeQ.position.x);
    labels.y.set(activeQ.position.y);

    // Change the position of the vector.
    vectors.force.setPosition(activeQ.position.x, activeQ.position.y);
    vectors.force.color = activeQ.color;

    // Set the position of the results box.
    results.setPosition(
      activeQ.position.x * w.scaleX.toPx + w.axis.position.x - results.width / 2,
      activeQ.position.y * w.scaleY.toPx + w.axis.position.y + 30
    );

    // Update field.
    // field.renderer.render()

  }

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(50, w.height - 50);
  position.setPosition(w.width - 20 - position.width, 20);
}
