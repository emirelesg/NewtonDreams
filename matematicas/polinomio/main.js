// Constants
var STEP = 0.1;

// Variables
var xMin = -5;
var xMax = 5;

// p$ Objects
var w;
var plot = new p$.Plot( {limit: 1000} );
var controls = {};

/**
 * Function runs when document is completely loaded.
 */
$(function() {
  setup();
  resize();
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
  w.scaleX.set(50, 2, "");
  w.scaleY.set(50, -2, "");

  // Add objects to world.
  w.add(plot);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.a0 = new p$.Slider({ id: "a0", start: 0, min: -5, max: 5, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.RED });
  controls.a1 = new p$.Slider({ id: "a1", start: 0, min: -5, max: 5, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.GREEN });
  controls.a2 = new p$.Slider({ id: "a2", start: 0, min: -1, max: 1, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.BLUE });
  controls.a3 = new p$.Slider({ id: "a3", start: 0, min: -1, max: 1, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.YELLOW });
  controls.a4 = new p$.Slider({ id: "a4", start: 0, min: -1, max: 1, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.PURPLE });
  
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

  // To plot from edge to edge obtain the position of the axis and convert it to real units
  xMin = -w.axis.position.x * w.scaleX.toUnits;
  xMax = xMin + w.width * w.scaleX.toUnits;

  // Evaluate function in range.
  plot.clear();
  for (var x = xMin; x <= xMax; x += STEP ) {
    y = controls.a0.value + controls.a1.value * x + controls.a2.value * Math.pow(x, 2) + controls.a3.value * Math.pow(x, 3) + controls.a4.value * Math.pow(x, 4);
    plot.addPoint(x, y);
  }

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
}