// Constants
var ROW_X_ID = ["tr#ax", "tr#bx", "tr#cx", "tr#dx"];      // Id of all -x sliders.
var FX_PARAMETERS = [2, 3, 2, 3, 4];                      // Amount of sliders required per -x function.
var ROW_Y_ID = ["tr#ay", "tr#by", "tr#cy", "tr#dy"];      // Id of all -y sliders.
var FY_PARAMETERS = [2, 3, 2, 3, 4];                      // Amount of sliders required per -y function.

// Variables
var started = false;                                      // Has the animation started?
var fx = 0;                                               // Index of the currently selected -x function.
var fy = 0;                                               // Index of the currently selected -y function.

// p$ Objects
var w;
var plot = new p$.Plot( { drawInvisiblePoints: true, limit: 600, color: p$.COLORS.BLUE } );
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
  w.scaleX.set(50, 2, "");
  w.scaleY.set(50, 2, "");

  // Add objects to world.
  w.add(plot);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.ax = new p$.Slider({ id: "ax", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.RED });
  controls.bx = new p$.Slider({ id: "bx", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.GREEN });
  controls.cx = new p$.Slider({ id: "cx", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.BLUE });
  controls.dx = new p$.Slider({ id: "dx", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.YELLOW });
  controls.ay = new p$.Slider({ id: "ay", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.RED });
  controls.by = new p$.Slider({ id: "by", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.GREEN });
  controls.cy = new p$.Slider({ id: "cy", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.BLUE });
  controls.dy = new p$.Slider({ id: "dy", start: 0, min: -5, max: 5, decPlaces: 1, units: "", callback: reset, color: p$.COLORS.YELLOW });

  // X function.
  controls.fx = new p$.dom.Select("fx", function(val) {
    fx = parseInt(val);
    for (var i = 0; i < 4; i++) {
      if (i < FX_PARAMETERS[fx - 1]) {
        $(ROW_X_ID[i]).removeClass('d-none');
      } else {
        $(ROW_X_ID[i]).addClass('d-none');
      }
    }
    reset();
  });

  // Y function.
  controls.fy = new p$.dom.Select("fy", function(val) {
    fy = parseInt(val);
    for (var i = 0; i < 4; i++) {
      if (i < FY_PARAMETERS[fy - 1]) {
        $(ROW_Y_ID[i]).removeClass('d-none');
      } else {
        $(ROW_Y_ID[i]).addClass('d-none');
      }
    }
    reset();
  });

  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    reset();
    started = true;
  });

  // Randomize button.
  controls.randomize = new p$.dom.Button("randomize", function() {
    reset();
    controls.ax.set(Math.random() * 10 - 5);
    controls.bx.set(Math.random() * 10 - 5);
    controls.cx.set(Math.random() * 10 - 5);
    controls.dx.set(Math.random() * 10 - 5);
    controls.ay.set(Math.random() * 10 - 5);
    controls.by.set(Math.random() * 10 - 5);
    controls.cy.set(Math.random() * 10 - 5);
    controls.dy.set(Math.random() * 10 - 5);
    started = true;
  });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Activate start button.
  controls.start.enabled(fx != 0 && fy != 0);
  controls.randomize.enabled(fx != 0 && fy != 0);

  // Clear plot.
  plot.clear();

  // Reset time.
  t = 0;
  started = false;

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Only run when animation has started.
  if (started) {

    // Calculate x value.
    var x = 0;
    if (fx === 1) {
      x = controls.ax.value * Math.cos(controls.bx.value * t);
    } else if (fx === 2) {
      x = controls.ax.value * Math.cos(controls.bx.value * t) * Math.exp(controls.cx.value * t);
    } else if (fx === 3) {
      x = controls.ax.value * Math.sin(controls.bx.value * t);
    } else if (fx === 4) {
      x = controls.ax.value * Math.sin(controls.bx.value * t) * Math.exp(controls.cx.value * t);
    } else if (fx === 5) {
      x = controls.ax.value + controls.bx.value * t + controls.cx.value * t * t + controls.dx.value * t * t * t;
    }
    
    // Calculate y value.
    var y = 0; 
    if (fy === 1) {
      y = controls.ay.value * Math.cos(controls.by.value * t);
    } else if (fy === 2) {
      y = controls.ay.value * Math.cos(controls.by.value * t) * Math.exp(controls.cy.value * t);
    } else if (fy === 3) {
      y = controls.ay.value * Math.sin(controls.by.value * t);
    } else if (fy === 4) {
      y = controls.ay.value * Math.sin(controls.by.value * t) * Math.exp(controls.cy.value * t);
    } else if (fy === 5) {
      y = controls.ay.value + controls.by.value * t + controls.cy.value * t * t + controls.dy.value * t * t * t;
    }

    // Add values to plot.
    plot.addPoint(x, y);

    // Increase time.
    t += 0.05;

  }

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);
}