// Constants
var MAX_ANGLE = 15;         // Defines the +/- range for the angles.
var CEILING_HEIGHT = 10;    // Defines the height of the ceiling in px.

/**
 * Pendulum object for handling both pendulums.
 */
var Pendulum = function(color, label) {
  this.ball = new p$.Ball(0.4, { color: color, upperLabel: label, isDraggable: false } );
  this.length = 0;
  this.omega = 0;
  this.current_angle = 0
  this.initial_angle = 0;
  this.ball.font.set( { size: 12 } );
  this.plot = undefined;
  this.period_label = undefined;
};

/**
 * Update the position of the pendulum through time. Also plot the current x position
 * of the pendulum.
 */
Pendulum.prototype.update = function(time) {
  this.current_angle = this.initial_angle * Math.cos(this.omega * time);
  this.ball.setPosition(
    this.length * Math.sin(p$.PI - this.current_angle), 
    this.length * Math.cos(p$.PI - this.current_angle)
  );
  this.plot.markers[0].x = time;
  this.plot.markers[0].y = this.ball.position.x;
  if (started) {
    this.plot.addPoint(t, this.ball.position.x);
  }
}

/**
 * Calculate the period of the pendulum. Required before calling update.
 */
Pendulum.prototype.setInitialConditions = function(length, angle) {
  this.length = length;
  this.initial_angle = angle;
  this.omega = Math.sqrt(9.81 / (this.length));
  this.period_label.set(2 * p$.PI / this.omega);
  this.plot.clear();
  this.plot.addMarker(0, 0);
}

// Variables
var started = false;
var t = 0;
var wasMouseOutside = false;

// p$ Objects
var w;
var dc = new p$.DataCursor({ constant: true });
var results = new p$.Box( { debug: false, title: "Resultados", isDraggable: false, color: p$.BOX_COLORS.BLUE } )
var box = new p$.Box( { debug: false, title: "Movimiento en -x", isDraggable: false } );
var graph = undefined;
var p1 = new Pendulum(p$.COLORS.GREEN, "1");
var p2 = new Pendulum(p$.COLORS.BLUE, "2");
var scene = new p$.Shape(drawScene);
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
  w.axis.display = false;
  w.scaleX.set(50, 1, "m");
  w.scaleY.set(50, -1, "m");

  // Define background.
  w.background.setCallback(function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = p$.BOX_COLORS.GRAY.BACKGROUND;
    ctx.rect(0, 0, w.width, w.height);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = p$.COLORS.BROWN;
    ctx.rect(0, 0, w.width, CEILING_HEIGHT);
    ctx.fill();
  });

  // Configure graph.
  graph = box.addGraph(300, 200, {});
  graph.legends(true);
  graph.setLabels("", "Tiempo [s]", "Movimiento en -x [m]");
  graph.setPosition(0, 20);
  graph.scaleX.set(35, 1);
  graph.scaleY.set(35, -0.5);
  graph.setAxisPosition("left", "center");
  p1.plot = graph.addPlot( { color: p$.COLORS.GREEN, label: "Péndulo 1" } );
  p2.plot = graph.addPlot( { color: p$.COLORS.BLUE, label: "Péndulo 2" } );
  box.calculateDimensions();

  // Configure labels.
  p1.period_label = results.addLabel(150, 14, { name: "Periodo 1: ", units: "s", labelWidth: 100, decPlaces: 2 });
  p1.period_label.setPosition(0, 25);
  p2.period_label = results.addLabel(150, 14, { name: "Periodo 2: ", units: "s", labelWidth: 100, decPlaces: 2 });
  p2.period_label.setPosition(0, 50);
  results.calculateDimensions();

  // Add plots to data cursor.
  dc.add(p1.plot, p2.plot);

  // Configure the z index of all objects.
  scene.setZ(1);
  p1.ball.setZ(2);
  p2.ball.setZ(2);
  box.setZ(3);
  results.setZ(4);
  dc.setZ(5);

  // Add objects to world.
  w.add(p1.ball, p2.ball, scene, box, results, dc);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders
  controls.angle = new p$.Slider({ id: "angle", start: -10, min: -MAX_ANGLE, max: MAX_ANGLE, decPlaces: 1, units: "°", callback: reset, color: p$.COLORS.RED });
  controls.mass1 = new p$.Slider({ id: "mass1", start: 1, min: 0.5, max: 2, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.GREEN });
  controls.lenght1 = new p$.Slider({ id: "length1", start: 3, min: 2, max: 7, decPlaces: 1, units: "m", callback: reset, color: p$.COLORS.GREEN });
  controls.mass2 = new p$.Slider({ id: "mass2", start: 1, min: 0.5, max: 2, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.BLUE });
  controls.length2 = new p$.Slider({ id: "length2", start: 5, min: 2, max: 7, decPlaces: 1, units: "m", callback: reset, color: p$.COLORS.BLUE });

  // Buttons.
  controls.start = new p$.dom.Button("start", function() {
    started = true;
  });
  controls.pause = new p$.dom.Button("pause", function() {
    started = false;
  });
  controls.reset = new p$.dom.Button("reset", function() {
    reset();
  });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Reset animation state.
  started = false;
  t = 0;

  // Set the angle of the pendulums.
  p1.setInitialConditions(controls.lenght1.value, controls.angle.value * p$.DEG_TO_RAD);
  p1.update(0);
  p2.setInitialConditions(controls.length2.value, controls.angle.value * p$.DEG_TO_RAD);
  p2.update(0);

  // Update radius of particles based on their mass.
  p1.ball.r = Math.pow(controls.mass1.value / (4 * p$.PI * 5 / 3), 1/3);
  p2.ball.r = Math.pow(controls.mass2.value / (4 * p$.PI * 5 / 3), 1/3);

  // Reset the axis position.
  graph.setAxisPosition();

}

/**
 * Draw callback for scene object. Draws the hanging wires for the pendulums
 * as well as the yellow valid area for the angle.
 */
function drawScene() {

  // Highlight the valid area for the pendulum.
  scene.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
  scene.stroke(p$.BOX_COLORS.GRAY.BORDER);
  scene.lineDash(5);
  scene.strokeWeight(2);
  scene.begin();
  scene.moveTo(0, 0);
  scene.lineTo(10 * Math.sin(MAX_ANGLE * p$.DEG_TO_RAD), -10 * Math.cos(MAX_ANGLE * p$.DEG_TO_RAD));
  scene.lineTo(10 * Math.sin(-MAX_ANGLE * p$.DEG_TO_RAD), -10 * Math.cos(-MAX_ANGLE * p$.DEG_TO_RAD));
  scene.lineTo(0, 0);
  scene.end();

  // Draw the wires that connect to the hanging masses.
  scene.noFill();
  scene.lineDash(0);
  scene.strokeWeight(2);
  
  // Draw the hanging wire of p1.
  scene.stroke(p$.COLORS.GRAY);
  scene.line(0, 0, p1.ball.position.x, p1.ball.position.y);

  // Draw hanging wire of p2.
  scene.stroke(p$.COLORS.GRAY);
  scene.line(0, 0, p2.ball.position.x, p2.ball.position.y);

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Set button states.
  controls.start.enabled(!started);
  controls.pause.enabled(started);
  controls.reset.enabled(started || t > 0);

  // Only animate if user has started the animation.
  if (started) {

    // Increase time.
    t += 2 / 60;

    // Update the position of the pendulums.
    p1.update(t);
    p2.update(t);

    // If the graph has gone outside of the available graph space, then move the x axis to fit the latest data.
    var maxDisplayTime = (graph.axis.width - graph.axis.position.x) * graph.scaleX.toUnits;
    if (t > maxDisplayTime) {
      graph.axis.position.x -= 2 / 60 * graph.scaleX.toPx;
    }

  }
}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {

    /**
     * Resizes the graph while keeping the last x position of the axis.
     * Since the x axis is sliding during the animation, the position must be restored.
     */
    function resizeGraph(w, h) {
      if (started) {
        var axis_x = graph.axis.position.x;
        graph.setDimensions(w, h);
        graph.axis.position.x = axis_x; 
      } else {
        graph.setDimensions(w, h)
      }
    }

    // If width > 350px display graph box.
    if (w.width > 350) {

      // Activate graph box.
      box.display = true;

      // Keep the pendulum at 1/4 the width of the canvas.
      w.axis.setPosition(w.width / 4, CEILING_HEIGHT);

      // Keep the width of the graph equal to the half of the canvas width.
      resizeGraph(w.width / 2, 200);

      // Recalculate the dimensions of the box and place it at the top right corner.
      box.calculateDimensions();
      box.setPosition(w.width - box.width - 20, 20);

      // Position results box below graph box.
      results.calculateDimensions();
      results.setPosition(w.width - results.width - 20, box.height + 40);

    } else {

      // Hide graph box.
      box.display = false;

      // Center pendulums horizontally.
      w.axis.setPosition(w.width / 2, CEILING_HEIGHT);

      // Position results box on top right corner.
      results.calculateDimensions();
      results.setPosition(w.width - results.width - 20, 20);

    }




}
