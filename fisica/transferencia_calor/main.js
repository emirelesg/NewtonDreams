// Constants
var BOX_L = 2.5;
var BOX_HL = BOX_L / 2;
var Y_OFFSET = 0.5;
var X_OFFSET = 0.5;
var k_cu = 371; // conductividad termica [W/K m]
var m = 1; // [kg]
var c_cu = 385; //calor especifico Cu [J/kg K]


var started = false;
var t_end = 3;
var t = 0;
var t1_initial = 0;
var t2_initial = 0;
var t1 = 0;
var t2 = 0;
var t_diff = 0;

// Variables
var points = [];  // 2d arrays for the arrows


// p$ Objects
var sim = new p$.Shape(drawSimulation);
var arrow = new p$.Shape(drawBaseArrow);
var arrows_1 = new p$.Shape(drawArrows_1);
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
  w.add(sim, arrows_1);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.Bar_width = new p$.Slider({ id: "Bar_width", start: 2, min: 0.5, max: 6, decPlaces: 1, units: "m", callback: reset });
  controls.Bar_height = new p$.Slider({ id: "Bar_height", start: 0.5, min: 0.1, max: 2, decPlaces: 2, units: "m", callback: reset });
  controls.T_1 = new p$.Slider({ id: "T_1", start: 30, min: 0, max: 100, decPlaces: 1, units: "C", callback: reset });
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
    reset();
    started = true;
  });
  
}

// Set the initial state of all variables.
function reset() {
  Bar_width = controls.Bar_width.value; //Gets bar width from slider
  Bh_half = controls.Bar_height.value / 2;

  t = 0;
  t_final = 3;
  started = false;

  t1_initial = controls.T_1.value;
  t1 = t1_initial;

  t2_initial = controls.T_2.value;
  t2 = t2_initial;
  
  //H un solo conductor
  H_1 = k_cu * (Math.PI * Bh_half *Bh_half) * (t2-t1) /  Bar_width 
}

function drawSimulation() {
  
  Bar_height = controls.Bar_height.value; //Gets bar height from slider
  Bw_half = controls.Bar_width.value / 2;
  Bh_half = controls.Bar_height.value / 2;
  x_leftcube = -1*Bw_half-BOX_HL-0.3; //x-coordinate of the bottom left side of the cube
  

  function tempColor(Temp){
    var normalised_T = Temp/100.
    if (normalised_T >1) {
      normalised_T = 1;
    } else if (normalised_T < 0){
      normalised_T = 0;
    }

    var h = 240 + (normalised_T * 120);
    //var b = 255 - 255*normalised_T;
    return {
      'BACKGROUND': "hsl("+h+",100%,90%)",
      'BORDER': "hsl("+h+",100%,30%)",
    }

  }

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

  
  drawCube(x_leftcube, 0, BOX_L, tempColor(t1)); //Function to draw the first cube
  
  var d = 1;
  sim.strokeWeight(2);
  sim.stroke(p$.BOX_COLORS.YELLOW.BORDER);
  sim.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);

  sim.save();
  sim.translate(-1*Bw_half, Y_OFFSET/2);
  sim.ellipse(0, 0, 0.2, Bh_half, 90, 270); //Draws the half ellipse of the stick
  sim.line(0, -1 * Bh_half,Bar_width , -1*Bh_half);//Draws the bottom line of the stick
  sim.line(0, Bh_half,Bar_width, Bh_half); //Draws the bottom top of the stick
  sim.noStroke();
  sim.rect(0, -1 * Bh_half,Bar_width, Bar_height); //Draws the stick
  sim.restore();

  drawCube(Bw_half+BOX_HL, 0, BOX_L, tempColor(t2)); //Function to draw the second cube
}

function drawBaseArrow() {
  
}

function drawArrows_1() {


}



/**
 * Function gets called 60x per second.
 */
function draw() {

  if (started) {

    if (Math.abs(t2 - t1) > 1) {

      t_diff = t2 - t1;
      t2 -= t_diff * 0.01;
      t1 += t_diff * 0.01;
  
      console.log(t1, t2);
      t += 1 / 60.0;
      
      if (H_1 > 0) {

      }
      
  
    } 
    
  }


}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height / 2);

  /* if (w.width<450){
    w.scaleX.set(50,5,"");
  } */

}
