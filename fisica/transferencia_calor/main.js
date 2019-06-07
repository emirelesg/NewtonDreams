// Constants
var BOX_L = 2;
var BOX_HL = BOX_L / 2;
var X_OFFSET = 1;
var Y_OFFSET = 0.5;

// Variables

// p$ Objects
var sim = new p$.Shape(drawSimulation);
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
  console.log(1);
});

/**
 * Initialize world and set up other objects.
 */
function setup() {
  
  // Configure the world.
  w = new p$.World("canvasContainer", draw, resize);

  // Configure the z index of all objects.

  // Add objects to world.
  w.add(sim);

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

function drawSimulation() {

  function drawCenteredRect(x, y, l) {
    sim.rect(x - l / 2, y - l / 2, l, l);
  }

  function drawCube(x, y, l, color) {

    sim.save();
    sim.translate(x, y);

    sim.strokeWeight(2);

    sim.fill(color.BACKGROUND);
    sim.stroke(color.BORDER);

    var hl = l / 2;

    drawCenteredRect(X_OFFSET, Y_OFFSET, l);
    drawCenteredRect(0, 0, l);

    // Top face.
    sim.begin();
    sim.moveTo(-hl, hl);
    sim.lineTo(-hl + X_OFFSET, hl + Y_OFFSET);
    sim.lineTo(hl + X_OFFSET, hl + Y_OFFSET);
    sim.lineTo(hl, hl);
    sim.lineTo(-hl, hl);
    sim.end();

    // Left Face
    sim.begin();
    sim.moveTo(hl, hl);
    sim.lineTo(hl + X_OFFSET, hl + Y_OFFSET);
    sim.lineTo(hl + X_OFFSET, -hl + Y_OFFSET);
    sim.lineTo(hl, -hl);
    sim.lineTo(hl, hl);
    sim.end();

    sim.restore();

  }

  
  var y = 1;

  drawCube(-3, y, BOX_L, p$.BOX_COLORS.RED);
  
  var d = 1;
  sim.save();
  sim.translate(-3 + BOX_HL + X_OFFSET / 2, y + Y_OFFSET / 2);
  sim.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
  sim.noStroke();
  sim.rect(0, -d / 2, 6 - BOX_L - X_OFFSET / 2, d);
  
  sim.stroke(p$.BOX_COLORS.YELLOW.BORDER);
  sim.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
  sim.ellipse(0, 0, 0.25, d / 2, 90, 270);

  sim.line(0, d / 2, 6 - BOX_L - X_OFFSET / 2, d / 2);
  sim.line(0, -d / 2, 6 - BOX_L - X_OFFSET / 2, -d / 2);



  sim.restore();
  
  
  drawCube(3, y, BOX_L, p$.BOX_COLORS.BLUE);

    
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
