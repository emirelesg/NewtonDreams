// Constants
var BOX_DENSITY = 1;            // Density in kg / m³.
var TABLE_HEIGHT = 0.2;         // Height of the table where the box slides.

// Variables
var started = false;            // Defines if the simulation has started.
var frame = 0;                  // Current simulation frame.
var box = {
  d: 0,                         // Distance traveled in -x by the box.
  x0: 0,                        // Initial -x position.
  y0: 0,                        // Initial -y position.
  side: 0,                      // Length of a side.
  halfSide: 0,                  // Half of the side length. 
  ax: 0                         // Acceleration in -x.
};

// p$ Objects
var w;
var dc = new p$.DataCursor();
var s = new p$.Shape(drawScene);
var force = new p$.Vector({ label: "F", color: p$.COLORS.RED, scale: 0.1, components: true });
var results = new p$.Box( { debug: false, title: "Resultados", isDraggable: false } );
var plots = {
  box: new p$.Box( { debug: false, title: "Trabajo", isDraggable: false } ),
  work: null,
  distance: []
};
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

  // Configure results box and add lab els.
  labels.accel = results.addLabel(135, 14, { name: "Accel", units: "m/s²", labelWidth: 70 });
  labels.work = results.addLabel(135, 14, { name: "Trabajo", units: "J", labelWidth: 70 });
  labels.t = results.addLabel(135, 14, { name: "t", units: "s", labelWidth: 70 });
  labels.accel.setPosition(0, 25);
  labels.work.setPosition(0, 50);
  labels.t.setPosition(0, 75);
  results.calculateDimensions();

  // Configure plot.
  var graph = plots.box.addGraph(300, 180, {});
  graph.legends(false);
  graph.scaleX.set(30, 1);
  graph.scaleY.set(30, -5);
  graph.setLabels("", "Distancia [m]", "Fuerza [N]");
  graph.setPosition(0, 20);
  plots.work = graph.addPlot( { shade: true, color: p$.COLORS.RED, shadeColor: p$.utils.rgbToRgba(p$.COLORS.RED, 0.15) } );
  plots.box.calculateDimensions();

  // Add plots to data cursor.
  dc.add(plots.work);

  // Configure force vector.
  force.font.set({ color: force.color });

  // Configure the z index of all objects.
  s.setZ(1);
  force.setZ(2);
  results.setZ(3);
  plots.box.setZ(4);
  dc.setZ(5);

  // Add objects to world.
  w.add(s, force, results, plots.box, dc);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.force      = new p$.Slider({ id: "force", start: 10, min: 0, max: 15, decPlaces: 1, units: "N", callback: reset });
  controls.angle      = new p$.Slider({ id: "angle", start: 0, min: -45, max: 45, decPlaces: 1, units: "°", callback: reset, color: p$.COLORS.GREEN });
  controls.distance   = new p$.Slider({ id: "distance", start: 5, min: 1, max: 7.5, decPlaces: 1, units: "m", callback: reset, color: p$.COLORS.BLUE });
  controls.mass       = new p$.Slider({ id: "mass", start: 2, min: 1, max: 5, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.YELLOW });
  controls.uk         = new p$.Slider({ id: "uk", start: 0, min: 0, max: 1, decPlaces: 2, units: "", callback: reset, color: p$.COLORS.PURPLE });
  
  // Configure buttons.
  controls.start = new p$.dom.Button("start", function() {
    // Reset the simulation only if the simulation has ended.
    started = true;
    if (frame >= plots.work.points.length - 1) frame = 0;
  });
  controls.pause = new p$.dom.Button("pause", function() {
    started = false;
  });
  controls.forward = new p$.dom.Button("forward", function() {
    started = false;
    frame += 5;
    if (frame >= plots.work.points.length) frame = plots.work.points.length - 1;
  });
  controls.back = new p$.dom.Button("back", function() {
    started = false;
    frame -= 5;
    if (frame < 0) frame = 0;
  });
  controls.reset = new p$.dom.Button("reset", function() {
    started = false;
    frame = 0;
  });
  
}

// Set the initial state of all variables and precalculates the simulation.
function reset() {

  // Stop any simulation.
  started = false;
  frame = 0;

  // Calculate the box dimentions and set the initial position.
  box.side      = Math.pow(controls.mass.value / BOX_DENSITY, 1 / 3);
  box.halfSide  = box.side / 2;
  box.x0        = -box.halfSide;
  box.y0        = box.halfSide;
  box.d         = 0;

  // Set the force vector.
  force.setMag(controls.force.value, controls.angle.value);

  // Calculate the acceleration of the block.
  // Fx - uk * N = m * ax
  // Fy + N - mg = 0  =>  N = mg - Fy
  var normal = controls.mass.value * 9.81 - force.y;
  box.ax = (force.x - controls.uk.value * normal) / controls.mass.value;
  if (box.ax < 0) box.ax = 0;
  
  // Clear all plots.
  plots.work.clear();
  plots.work.addMarker(0, 0);
  plots.distance = [];

  // Function that calculates the simulation at the provided time.
  function calc(t) {
    var d = box.ax * t * t / 2;
    plots.distance.push([t, d]);
    plots.work.points.push([d, force.x - controls.uk.value * normal])
  }

  // Only simulate if the box is accelerating.
  if (box.ax > 0) {
    var totalTime = Math.sqrt(2 * controls.distance.value / box.ax);
    for (var t = 0; t <= totalTime; t += 1 / 30.0) calc(t);
    calc(totalTime);
  } else {
    plots.distance.push([0, 0])
    plots.work.points.push([0, 0]);
  }

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Update the control buttons, depending on the current frame.
  controls.start.enabled(!started && box.ax > 0);
  controls.pause.enabled(started);
  controls.back.enabled(frame > 0);
  controls.forward.enabled(frame < plots.work.points.length - 1 && box.ax > 0);
  controls.reset.enabled(started || frame > 0);

  // Update animation.
  if (started) {
    if (frame < plots.work.points.length - 1) {
      frame += 1;
    } else {
      started = false;
    }
  }

  // Place the box.
  box.d = plots.work.points[frame][0];

  // Place the marker.
  plots.work.markers[0].x = plots.work.points[frame][0];
  plots.work.markers[0].y = plots.work.points[frame][1];

  // Display the plot until the current frame.
  plots.work.displayUntil = frame;
  
  // Place the force vector on the box.
  force.setPosition(box.x0 + box.d + box.halfSide, box.y0);
  
  // Set labels.
  labels.accel.set(box.ax);
  labels.t.set(plots.distance[frame][0]);
  labels.work.set(plots.work.points[frame][0] * plots.work.points[frame][1]);
    
}

/**
 * Function draws the block and surface.
 */
function drawScene() {

  // Draw box.
  s.save();
  s.translate(box.x0 + box.d, box.y0);
  s.begin();
  s.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
  s.stroke(p$.BOX_COLORS.YELLOW.BORDER);
  s.rect(-box.halfSide, -box.halfSide, box.side, box.side);
  s.font.set({ color: p$.FONT_COLOR });
  s.text(controls.mass.label.val(), 0, 0);
  s.restore();
  s.end();

  // Draw sliding surface.
  s.begin();
  s.fill(p$.COLORS.BROWN);
  s.stroke(p$.COLORS.BROWN);
  s.rect(-10, 0, 25, -TABLE_HEIGHT);
  s.end();

  // Draw displacement guide.
  s.font.set({ size: 14, color: p$.COLORS.GRAY });
  s.font.toCtx(s.selectCtx());
  var guideHeight = 0.25;
  var labelWidth = w.ctx.measureText(controls.distance.label.val()).width * w.scaleX.toUnits;
  var distance = controls.distance.value;
  s.save();
  s.translate(0, -0.75);
  s.begin();
  s.stroke(p$.COLORS.GRAY);
  s.moveTo(0, guideHeight);
  s.lineTo(0, -guideHeight);
  if (distance > labelWidth + 0.5) {
    s.moveTo(0, 0);
    s.lineTo(controls.distance.value / 2 - labelWidth / 2 - 0.25, 0);
    s.moveTo(controls.distance.value / 2 + labelWidth / 2 + 0.25, 0);
    s.lineTo(controls.distance.value, 0);
  }
  s.moveTo(controls.distance.value, guideHeight);
  s.lineTo(controls.distance.value, -guideHeight);
  s.end();
  s.text(controls.distance.label.val(), controls.distance.value / 2, 0);
  s.restore();

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(100, w.height - 60);
  results.setPosition(20, 20);
  if (w.width > 510) {
    plots.box.setPosition(w.width - plots.box.width - 20, 20);
    results.display = true;
  } else {
    plots.box.setPosition(w.width / 2 - plots.box.width / 2, 20);
    results.display = false;
  }
}
