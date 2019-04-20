// Variables
var operation = "option1";    // Selected opertion by the user.
var animPercentage = 0;       // Counts the progress of the animation.
var animate = false;          // Starts when the user clicks the start button.

// p$ Objects
var w;
var a = { vector: new p$.Vector( { color: p$.COLORS.RED }) };
var b = { vector: new p$.Vector( { color: p$.COLORS.BLUE }) };
var r = new p$.Vector( { color: p$.COLORS.GREEN });
var box = new p$.Box( { debug: false, title: "Resultados", isDraggable: false } );
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
  w.scaleX.set(50, 10, "");
  w.scaleY.set(50, -10, "");

  // Configure box and add labels for resultant mag and angle.
  labels.ang = box.addLabel(140, 14, { name: "Ángulo", units: "°", decPlaces: 1 });
  labels.ang.setPosition(0, 50);
  labels.mag = box.addLabel(140, 14, { name: "Magnitud", units: "cm", decPlaces: 1 });
  labels.mag.setPosition(0, 25);
  
  // Configure the z index of all objects.
  a.vector.setZ(1);
  b.vector.setZ(1);
  r.setZ(2);
  box.setZ(10);

  // Add objects to world.
  w.add(a.vector, b.vector, r, box);

}

/**
 * Setup DOM elements.
 */
function setupControls() {
  a.mag = new p$.Slider({ id: "a_mag", start: 30, min: 0, max: 30, decPlaces: 1, units: "cm", callback: reset });
  a.ang = new p$.Slider({ id: "a_ang", start: 0, min: 0, max: 360, decPlaces: 0, units: "°", callback: reset });
  b.mag = new p$.Slider({ id: "b_mag", start: 15, min: 0, max: 30, decPlaces: 1, units: "cm", color: p$.COLORS.BLUE, callback: reset });
  b.ang = new p$.Slider({ id: "b_ang", start: 90, min: 0, max: 360, decPlaces: 0, units: "°", color: p$.COLORS.BLUE, callback: reset });
  controls.start = new p$.dom.Button("calculate", function() {
    reset();
    animate = true;
    this.enabled(false);
  });
  controls.options = new p$.dom.Options("options", function(o) {
    reset();
    operation = o;
  });
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Reset start button.
  controls.start.enabled(true);

  // Stop any animations.
  animate = false;
  animPercentage = 0;
  
  // Reset vectors.
  a.vector.setPosition(0, 0);
  b.vector.setPosition(0, 0);
  r.set(0, 0);
  setVectors();

  // Reset box labels.
  labels.mag.set("-");
  labels.ang.set("-");

}

/**
 * Set the values from the sliders to the corresponding vector.
 */
function setVectors() {
  a.vector.setMag(a.mag.value, a.ang.value);
  b.vector.setMag(b.mag.value, b.ang.value);
}

/**
 * Animate the operation A + B.
 */
function aPlusB() {
  if (animPercentage <= 50) {
    b.vector.setPosition(
      (a.vector.x * animPercentage) / 50,
      (a.vector.y * animPercentage) / 50
    );
  } else if (animPercentage <= 100) {
    r.set(
      ((a.vector.x + b.vector.x) * (animPercentage - 50)) / 50,
      ((a.vector.y + b.vector.y) * (animPercentage - 50)) / 50
    );
  } else {
    setResultantVector();
  }
}

/**
 * Animate the operation A - B.
 */
function aMinusB() {
  if (animPercentage <= 50) {
    b.vector.setPosition(
      (a.vector.x * animPercentage) / 50,
      (a.vector.y * animPercentage) / 50
    );
  } else if (animPercentage <= 100) {
    b.vector.setMag(
      (b.mag.value * (75 - animPercentage)) / 25,
      b.ang.value,
      p$.DEG
    );
  } else if (animPercentage <= 150) {
    r.set(
      ((a.vector.x + b.vector.x) * (animPercentage - 100)) / 50,
      ((a.vector.y + b.vector.y) * (animPercentage - 100)) / 50
    );
  } else {
    setResultantVector();
  }
}

/**
 * Animate the operation B - A.
 */
function bMinusA() {
  if (animPercentage <= 50) {
    a.vector.setPosition(
      (b.vector.x * animPercentage) / 50,
      (b.vector.y * animPercentage) / 50
    );
  } else if (animPercentage <= 100) {
    a.vector.setMag(
      (a.mag.value * (75 - animPercentage)) / 25,
      a.ang.value,
      p$.DEG
    );
  } else if (animPercentage <= 150) {
    r.set(
      ((a.vector.x + b.vector.x) * (animPercentage - 100)) / 50,
      ((a.vector.y + b.vector.y) * (animPercentage - 100)) / 50
    );
  } else {
    setResultantVector();
  }
}

/**
 * Animate the operation A . B.
 */
function dotAB() {
  labels.mag.set(a.vector.dot(b.vector));
  animate = false;
  $("#calculate").prop("disabled", false);
}

/**
 * Finisch animation and set resultant vector.
 */
function setResultantVector() {

  // Get resultant angle and standarize it.
  var angle = r.angle(p$.DEG);
  if (angle < 0) angle = 360 + angle;

  // Set box labels.
  labels.mag.set(r.mag());
  labels.ang.set(angle);

  // Stop animations and reset start button.
  animate = false;
  controls.start.enabled(true);

}

/**
 * Function gets called 60x per second.
 */
function draw() {
  if (animate) {
    animPercentage++;
    switch (operation) {
      case "option1": aPlusB(); break;
      case "option2": aMinusB(); break;
      case "option3": bMinusA(); break;
      case "option4": dotAB(); break;
    }
  } else if (animPercentage === 0) {
    setVectors();
  }
}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
  box.setPosition(20, 20);
}