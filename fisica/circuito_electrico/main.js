// Constants
var BG = p$.BOX_COLORS.GRAY.BACKGROUND;   // Background color of the simulation.
var TRIANLGE_SIDE = 0.4;                  // Default side length for current triangles.
var LEAD = 0.4;                           // Length of component leads.
var K1 = 0.35;                            // Longest line of the battery symbol.
var K2 = 0.15;                            // Shortest line of the battery symbol.
var BS = 0.2;                             // Step bewteen lines in the battery.
var BH = BS + BS / 2 + LEAD;              // Total height of the battery.
var SIGN = 0.1;                           // Length of the lines for the plus and minus.
var RX = 0.35 * p$.COS60;                 // X position for drawing the resistor.
var RY = 0.35 * p$.SIN60;                 // Y position for drawing the resistor.
var RH = 2 * RY;                          // Resistor height.
var RW = 2 * LEAD + RX * 7;               // Resistor width.
var RES = [                               // Coordinates for drawing the resistor.
  [LEAD, 0],
  [RX / 2, RY / 2],
  [RX, -RY],
  [RX, RY],
  [RX, -RY],
  [RX, RY],
  [RX, -RY],
  [RX, RY],
  [RX / 2, -RY / 2],
  [LEAD, 0]
]
var TEXT_SEPARATION = 0.6;                // Space between components and their labels.

// Variables
var width = 0;                            // Available width for the simulation in units.
var height = 0;                           // Available height of the simulation in units.
var half_height = 0;                      // Half of the height.
var k = 2.2;                              // Space between R1 and R2.
var r_eq = 0;                             // Total equivalent resistance of the circuit.
var i_total = 0;                          // Total current of the circuit.
var vr3 = 0;                              // Voltage on R3.
var vr12 = 0;                             // Voltage on R1 and R2.
var ir1 = 0;                              // Current flowing through R1.
var ir2 = 0;                              // Current flowing through R2.
var i_ratio = 0;                          // Percent difference between Ir1 and Ir2. Used for scaling the current triangles.

// p$ Objects
var w;      
var controls = {};
var circuit = new p$.Shape(drawCircuit);

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
  w.color = BG;

  // Prerender the circuit
  circuit.renderer.render();

  // Configure the z index of all objects.
  circuit.setZ(1);

  // Add objects to world.
  w.add(circuit);

  // Configure circuit shape.
  circuit.font.set( { size: 16, align: "center" } );

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.v1 = new p$.Slider({ id: "v1", start: 5, min: 1, max: 12, decPlaces: 12, units: "V", callback: reset, color: p$.COLORS.RED });
  controls.r1 = new p$.Slider({ id: "r1", start: 500, min: 1, max: 1500, decPlaces: 0, units: p$.SYMBOL.OHM, callback: reset, color: p$.COLORS.GREEN });
  controls.r2 = new p$.Slider({ id: "r2", start: 500, min: 1, max: 1500, decPlaces: 0, units: p$.SYMBOL.OHM, callback: reset, color: p$.COLORS.BLUE });
  controls.r3 = new p$.Slider({ id: "r3", start: 500, min: 1, max: 1500, decPlaces: 0, units: p$.SYMBOL.OHM, callback: reset, color: p$.COLORS.YELLOW });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Calculate equivalent resistance.
  r_eq = controls.r3.value + 1 / (1 / controls.r1.value + 1 / controls.r2.value);
  
  // Calculate the total current of the circuit.
  i_total = controls.v1.value / r_eq;

  // Calculate currents and voltages per resistor.
  vr3 = controls.r3.value * i_total;
  vr12 = controls.v1.value - vr3;
  ir1 = vr12 / controls.r1.value
  ir2 = vr12 / controls.r2.value;

  // Calculate the percent difference between Ir1 and Ir2.
  // Multiplied by 0.05 to affect the scale of the triangles.
  i_ratio = 0.05 * (ir1 - ir2) / ((ir1 + ir2) / 2);

  // Render circuit
  circuit.renderer.render();

}

/**
 * Draw the circuit.
 */
function drawCircuit() {

  /**
   * Function used to draw a battery centered on (x0, y0).
   */
  function drawBattery(x0, y0, color) {
    var top = y0 + BS + BS / 2;
    var bottom = y0 - BS - BS / 2;
    circuit.noStroke();
    circuit.fill(BG);
    circuit.rect(x0 - K1, y0 - BH, 2 * K1, 2 * BH)
    circuit.stroke(color);
    circuit.line(x0, top, x0, top + LEAD);
    for (var i = -2; i < 2; i += 1) {
        var h = i * BS + BS / 2;
        var k = i % 2 !== 0 ? K1 : K2;
        circuit.line(x0 - k, y0 + h, x0 + k, y0 + h);
      }
    circuit.line(x0, bottom, x0, bottom - LEAD);
  }

  /**
   * Function used to draw a battery starting on (x0, y0).
   */
  function drawResistor(x0, y0, color, vertical) {
    if (vertical) {
      circuit.save();
      circuit.translate(x0, y0);
      circuit.rotate(-90);
      x0 = 0;
      y0 = 0;
    }
    circuit.noStroke();
    circuit.fill(BG);
    circuit.rect(x0, y0 - RY, RW, RH);
    circuit.noFill();
    circuit.stroke(color);
    circuit.begin(p$.SHAPE_STYLE.ACCOMULATIVE);
    circuit.moveTo(x0, y0);
    for (var i = 0; i < RES.length; i += 1) {
      circuit.lineTo(RES[i][0], RES[i][1]);
    }
    circuit.end();    
    if (vertical) {
      circuit.restore();
    }
  }

  /**
   * Function used to draw a plus sign centered on (x0, y0).
   */
  function drawPlus(x0, y0, color) {
    circuit.stroke(color);
    circuit.line(x0 - SIGN, y0, x0 + SIGN, y0);
    circuit.line(x0, y0 - SIGN, x0, y0 + SIGN);
  }


  /**
   * Function used to draw a neg sign centered on (x0, y0).
   */
  function drawMinus(x0, y0, color) {
    circuit.stroke(color);
    circuit.line(x0 - SIGN, y0, x0 + SIGN, y0);
  }

  /**
   * Returns the formated label for the current.
   */
  function fixCurrent(i) {
    if (i > 1) {
      return p$.utils.round(i, 2) + " A";
    } else if (i > 0.01) {
      return p$.utils.round(i * 1000, 1) + " mA";
    }
    return p$.utils.round(i * 1000, 2) + " mA";
  }
    
  // Wires
  circuit.strokeWeight(2);
  circuit.stroke(p$.COLORS.BLACK);
  circuit.fill(BG);
  circuit.rect(0, 0, width - k / 2, height);
  circuit.rect(width - k, half_height - RW / 2 - 3 * LEAD, k, RW + 6 * LEAD)
  
  // Battery
  circuit.font.set( { align: "left" } );
  circuit.text(controls.v1.value + " V", TEXT_SEPARATION, half_height);
  drawBattery(0, half_height, p$.COLORS.RED);
  drawPlus(TEXT_SEPARATION, half_height + BH, p$.COLORS.RED);
  drawMinus(TEXT_SEPARATION, half_height - BH, p$.COLORS.RED);
  circuit.font.set( { align: "center" } );
  
  // R1
  var r1_x = width - k - TEXT_SEPARATION;
  var r1_y = half_height - TEXT_SEPARATION;
  circuit.text("R1", r1_x, r1_y + TEXT_SEPARATION/2);
  drawResistor(width - k, r1_y + RW / 2, p$.COLORS.GREEN, true);
  drawPlus(r1_x, r1_y + RW / 2, p$.COLORS.GREEN);
  drawMinus(r1_x, r1_y - RW / 2, p$.COLORS.GREEN);
  
  // R2
  var r2_x = width - TEXT_SEPARATION;
  circuit.text("R2", r2_x, r1_y + TEXT_SEPARATION/2);
  drawResistor(width, r1_y + RW / 2, p$.COLORS.BLUE, true);
  drawPlus(r2_x, r1_y + RW / 2, p$.COLORS.BLUE);
  drawMinus(r2_x, r1_y - RW / 2, p$.COLORS.BLUE);
  
  // R3
  var r3_x = (width - RW - k) / 2;
  circuit.text("R3", r3_x + RW / 2, TEXT_SEPARATION + TEXT_SEPARATION);
  circuit.text(p$.utils.round(vr3, 2) + " V", r3_x + RW / 2, TEXT_SEPARATION);
  drawResistor(r3_x, 0, p$.COLORS.YELLOW, false);
  drawPlus(r3_x, TEXT_SEPARATION, p$.COLORS.YELLOW);
  drawMinus(r3_x + RW, TEXT_SEPARATION, p$.COLORS.YELLOW);

  // Itotal Current Arrow
  var i1_x = (width - k) / 2;
  circuit.noStroke();
  circuit.fill(p$.COLORS.PURPLE);
  circuit.equilateralTriangle(i1_x, height, TRIANLGE_SIDE);
  circuit.text(fixCurrent(i_total), i1_x, height - TEXT_SEPARATION);

  // // I Current Arrow
  // Only draw if the width is larger than 8 units.
  if (width > 8) {
    circuit.stroke(p$.COLORS.PURPLE);
    circuit.noFill();
    circuit.arc(i1_x, half_height, 1, 225, 135);
    circuit.text("I(total)", i1_x, half_height);
    circuit.save();
    circuit.translate(i1_x + 1 * p$.utils.cos(225, p$.ANGLE_STYLE.DEG), half_height + 1 * p$.utils.sin(225, p$.ANGLE_STYLE.DEG));
    circuit.rotate(-225);
    circuit.noStroke(); 
    circuit.fill(p$.COLORS.PURPLE);
    circuit.equilateralTriangle(0, 0, TRIANLGE_SIDE);
    circuit.restore();
  }

  // I1 Current Arrow
  var i1_y = r1_y + RW / 2 + 3 * TEXT_SEPARATION / 2;
  circuit.font.set( { align: "right" } );
  circuit.equilateralTriangle(width - k, i1_y, TRIANLGE_SIDE + i_ratio - 0.1, -90);
  circuit.text(fixCurrent(ir1), width - k - TEXT_SEPARATION / 2, i1_y);

  // I2 Current Arrow
  circuit.equilateralTriangle(width, i1_y, TRIANLGE_SIDE - i_ratio - 0.1, -90);
  circuit.text(fixCurrent(ir2), width - TEXT_SEPARATION / 2, i1_y);

  // V1 and V2
  circuit.text(p$.utils.round(vr12, 2) + " V", r2_x + TEXT_SEPARATION / 3, r1_y - TEXT_SEPARATION / 2);
  circuit.text(p$.utils.round(vr12, 2) + " V", r1_x + TEXT_SEPARATION / 3, r1_y - TEXT_SEPARATION / 2);

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
  
  // Calculate margin depedning on the width.
  var margin = w.width < 400 ? 25 : 50;

  // Calculate R1 and R2 separation depending on width.
  k = w.width < 400 ? 2 : 2.5;

  // Set axis position.
  w.axis.setPosition(margin, w.height - margin);

  // Calculate total dimensions available.
  width = (w.width - margin * 2) * w.scaleX.toUnits;
  height = Math.abs((w.height - margin * 2) * w.scaleY.toUnits);

  // Calculate halfs.
  half_height = height / 2;

}
