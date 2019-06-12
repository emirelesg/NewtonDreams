// Constants
var BOX_L = 2;
var BOX_HL = BOX_L / 2;
var Y_OFFSET = 0.5;
var X_OFFSET = 0.5;

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
  //console.log(2);
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
  controls.Bar_width = new p$.Slider({ id: "Bar_width", start: 2, min: 0.5, max: 6, decPlaces: 1, units: "m", callback: reset });
  controls.Bar_height = new p$.Slider({ id: "Bar_height", start: 0.5, min: 0.1, max: 2, decPlaces: 2, units: "m", callback: reset });
  controls.T_1 = new p$.Slider({ id: "T_1", start: 30, min: 20, max: 100, decPlaces: 1, units: "C", callback: reset });
  controls.T_2 = new p$.Slider({ id: "T_2", start: 20, min: 10, max: 80, decPlaces: 1, units: "C", callback: reset });
  
  
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
  Bar_width = controls.Bar_width.value; //Gets bar width from slider
  Bar_height = controls.Bar_height.value; //Gets bar height from slider
  Bw_half = controls.Bar_width.value / 2;
  Bh_half = controls.Bar_height.value / 2;
  x_leftcube = -1*Bw_half-BOX_HL-0.3; //x-coordinate of the bottom left side of the cube
  
  /////Mariana
  /* function drawBar() {
    sim.rect(-1*Bw_half, -1 * Bh_half,Bar_width, Bar_height);
  }
  drawBar(Bar_width,Bar_height);

  function drawCube(){
    sim.save();
    //sim.translate(x,y);
    sim.translate((-1*Bw_half)-(l_cube/2)-0.5,0);
    sim.rect(-l_cube/2, -l_cube/2,l_cube, l_cube);
    sim.restore();
  }
  //drawCube(Bw_half-X_OFFSET,l_cube); //trasero
  drawCube(Bw_half,l_cube); //delantero */

//drawCenteredRect(X_OFFSET, Y_OFFSET, l);
  //drawCenteredRect(0, 0, l);
  /////Mariana



  

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

  
  drawCube(x_leftcube, 0, BOX_L, p$.BOX_COLORS.RED); //Function to draw the first cube
  
  var d = 1;
  //sim.save();
  //sim.translate(-3 + BOX_HL + X_OFFSET / 2, y + Y_OFFSET / 2);
  //sim.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
  //sim.noStroke();
  //sim.rect(0, -d / 2, 6 - BOX_L - X_OFFSET / 2, d);
  //sim.rect(0, -d / 2, 6 - BOX_L - X_OFFSET / 2, d);
  
  sim.stroke(p$.BOX_COLORS.YELLOW.BORDER);
  sim.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
  //sim.ellipse(0, 0, 0.25, d / 2, 90, 270);

  //sim.line(0, d / 2, 6 - BOX_L - X_OFFSET / 2, d / 2);
  //sim.line(0, -d / 2, 6 - BOX_L - X_OFFSET / 2, -d / 2);
  //sim.restore();
  
  
  sim.ellipse(-1*Bw_half, 0, 0.18, Bh_half, 90, 270); //Draws the half ellipse of the stick
  sim.rect(-1*Bw_half, -1 * Bh_half,Bar_width, Bar_height); //Draws the stick
  
  drawCube(Bw_half+BOX_HL, 0, BOX_L, p$.BOX_COLORS.BLUE); //Function to draw the second cube
    
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
