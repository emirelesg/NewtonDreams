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
  controls.vs = new p$.Slider({ id: "vs", start: 218, min: 200, max: 250, decPlaces: 0, units: "m/s", callback: reset });
  controls.vi = new p$.Slider({ id: "vi", start: 207, min: 200, max: 250, decPlaces: 0, units: "m/s", callback: reset, color: p$.COLORS.GREEN });
  
  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    console.log("start");
  });

  // Pause button.
  controls.pause = new p$.dom.Button("pause", function() {
    console.log("pause");
  });

  // Stop button.
  controls.stop = new p$.dom.Button("stop", function() {
    console.log("stop");
  });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
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