// Constants

// Variables

// p$ Objects
var w;
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

  // Configure the z index of all objects.

  // Add objects to world.

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.var1 = new p$.Slider({ id: "var1", start: 30, min: 0, max: 30, decPlaces: 1, units: "cm", callback: reset });
  controls.var2 = new p$.Slider({ id: "var2", start: 0, min: 0, max: 360, decPlaces: 0, units: "°", callback: reset });
  
  // Options options.
  controls.op = new p$.dom.Options("options", function(o) {
    console.log(o);
  });

  // Option option.
  controls.op2 = new p$.dom.Option("opcion", function(c) {
    console.log(c);
  });

  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    console.log("start");
  });
  
}

// Set the initial state of all variables.
function reset() {

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
}
