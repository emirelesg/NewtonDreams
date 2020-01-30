// Constants
var XMIN = -7;          // Start of the normal distribution.
var XMAX = 7;           // End of the normal distribution.
var STEP = 0.02;        // Step made every interation.

// Variables

// p$ Objects
var w;
var dc = new p$.DataCursor();
var g1 = new p$.Plot({ limit: 800, drawInvisiblePoints: true });
var g2 = new p$.Plot({ limit: 800, color: p$.COLORS.BLUE, drawInvisiblePoints: true });
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
  w.scaleY.set(70, -0.25, "");
  w.axis.outsideNumbers = false;
  w.axis.draggable(false);

  // Add plots to data cursor.
  dc.add(g1, g2);

  // Add objects to world.
  w.add(g1, g2, dc);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.s1 = new p$.Slider({ id: "s1", start: 0.5, min: 0.01, max: 2, decPlaces: 2, units: "", callback: reset });
  controls.u1 = new p$.Slider({ id: "u1", start: 0, min: -3, max: 3, decPlaces: 2, units: "", callback: reset });
  controls.s2 = new p$.Slider({ id: "s2", start: 1.5, min: 0.01, max: 2, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.BLUE });
  controls.u2 = new p$.Slider({ id: "u2", start: 0, min: -3, max: 3, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.BLUE });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Plot distribution 1.
  g1.clear();
  for (var i = XMIN; i <= XMAX; i += STEP) {
    var y1 = (1/(controls.s1.value*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow(((i-controls.u1.value)/controls.s1.value),2));
    g1.addPoint(i, y1);
  }

  // Plot distribution 2.
  g2.clear();
  for (var i = XMIN; i <= XMAX; i += STEP) {
    var y2 = (1/(controls.s2.value*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*Math.pow(((i-controls.u2.value)/controls.s2.value),2));
    g2.addPoint(i, y2);
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
    w.axis.setPosition(w.width / 2, w.height);
}
