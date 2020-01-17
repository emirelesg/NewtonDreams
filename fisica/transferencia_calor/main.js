// Constants
var OFX = 0.6;                              // Offset in the -x axis for the 3d perspective.
var OFY = 0.3;                              // Offset in the -y axis for the 3d perspective.
var BOX_LABEL_WIDTH = 70;                   // Width of labels in the result box.
var MIN_TEMP = -20, MAX_TEMP = 300;         // Define the temperature range.
var FONT_COLOR = "#444444";                 // Default font color.
var TEMP_GRADIENT = [[0, 0, 255], [0, 0, 100], [255, 0, 0], [255, 0, 0], [255, 50, 0]];   // Defines the colors in the gradient. They are equally spaced.
var BLOCK_W = 2.5;                          // Width the blocks that will transfer heat.
var ARROW_BODY_H = 0.3;                     // Height of the arrow's body.
var ARROW_HEAD_L = 0.8;                     // Side length of the arrow's head.
var ARROW_HEAD_H = ARROW_HEAD_L * p$.SIN60; // Height of the arrow's head.

// Variables
var heatTransfer = 0;                 // Heat transfered between objects.
var t1Color = 0;                      // RGB array with the respective color to the temp 1.
var t2Color = 0;                      // RGB array with the respective color to the temp 2.
var barWidth = 0, barHeight = 0;      // Dimensions of the transfer bar.
var arrowBodyW = 0;

// p$ Objects
var controls = {};
var labels = {};
var sim = new p$.Shape(drawSimulation);
var results = new p$.Box( { debug: false, title: "Resultados", display: true, isDraggable: false } );

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
  w.color = p$.BOX_COLORS.GRAY.BACKGROUND;

  // Configure results box
  labels.heatTransfer = results.addLabel(130, 14, { name: "Corriente", units: "W", labelWidth: BOX_LABEL_WIDTH, decPlaces: 1 } );
  labels.heatTransfer.setPosition(0, 25);
  results.calculateDimensions();

  // Configure the z index of all objects.

  // Add objects to world.
  w.add(sim, results);

}

/**
 * Setup DOM elements.
 */
function setupControls() {
  controls.barLength = new p$.Slider({ id: "bar_length", start: 1.25, min: 0.5, max: 3, decPlaces: 2, units: "m", callback: reset });
  controls.barArea = new p$.Slider({ id: "bar_area", start: 0.15, min: 0.1, max: 1, decPlaces: 2, units: "m²", callback: reset, color: p$.COLORS.GREEN });
  controls.k = new p$.Slider({ id: "k", start: 33, min: 0.01, max: 400, decPlaces: 1, units: "J/sm°C", callback: reset, color: p$.COLORS.BLUE });
  controls.t1 = new p$.Slider({ id: "t1", start: 102, min: MIN_TEMP, max: MAX_TEMP, decPlaces: 1, units: "°C", callback: reset });
  controls.t2 = new p$.Slider({ id: "t2", start: 31, min: MIN_TEMP, max: MAX_TEMP, decPlaces: 1, units: "°C", callback: reset });
}

/**
 * Function used to darken a color. The color must be provided in an array.
 */
function shadeColor(color, percent) {
  var amt = Math.round(2.55 * percent);
  var R = color[0] + amt;
  var G = color[1] + amt;
  var B = color[2] + amt;
  return '#' + (0x1000000 + (R < 255 ? R : 255) * 0x10000 + (G < 255 ? G : 255) * 0x100 + (B < 255 ? B : 255)).toString(16).slice(1);
}

/**
 * Converts a temperature to a color according to the defined gradient.
 */
function tempToColor(t) {
  
  // Normalize temperature between 0 and 1.
  var normT = (t + Math.abs(MIN_TEMP)) / (Math.abs(MIN_TEMP) + Math.abs(MAX_TEMP));
  if (normT < 0) normT = 0;
  if (normT > 1) normT = 1;

  // Determine between which colors the temperature is.
  var c1Idx = normT >= 1 ? TEMP_GRADIENT.length - 2 : Math.floor(normT * (TEMP_GRADIENT.length - 1));
  var c2Idx = c1Idx + 1;

  // Where between those colors is the current.
  var percentStep = 1 / (TEMP_GRADIENT.length - 1);
  var k = (normT - (percentStep * c1Idx)) / percentStep;

  // Interpolate between those colors.
  var r = Math.floor((TEMP_GRADIENT[c2Idx][0] - TEMP_GRADIENT[c1Idx][0]) * k + TEMP_GRADIENT[c1Idx][0]);
  var g = Math.floor((TEMP_GRADIENT[c2Idx][1] - TEMP_GRADIENT[c1Idx][1]) * k + TEMP_GRADIENT[c1Idx][1]);
  var b = Math.floor((TEMP_GRADIENT[c2Idx][2] - TEMP_GRADIENT[c1Idx][2]) * k + TEMP_GRADIENT[c1Idx][2]);
  return [r, g, b];

} 


// Set the initial state of all variables.
function reset() {

  // Calculate the transfer of heat between both objects.
  heatTransfer = ((controls.k.value * controls.barArea.value) * (controls.t1.value - controls.t2.value)) / controls.barLength.value;
  labels.heatTransfer.set(heatTransfer);

  // Calculate the block's colors.
  t1Color = tempToColor(controls.t1.value);
  t2Color = tempToColor(controls.t2.value);

  // Set the sliders' color.
  controls.t1.setColor(shadeColor(t1Color, 40));
  controls.t2.setColor(shadeColor(t2Color, 40));

  // Bar dimensions.
  barLength = controls.barLength.value;
  barWidth = Math.sqrt(controls.barArea.value);

  // Dimensions of the arrow.
  arrowBodyW = Math.abs(heatTransfer / 100);

}

/**
 * Function gets called 60x per second.
 */
function draw() {
}

/**
 * Draws a fake rectangular prism.
 */
function draw3dRect(x, y, width, height, color, color2) {

  // Colors used to shade the cube.  
  var cTop, cFront, cRight, cFrontBorder, cTopBorder, cRightBorder;
  
  // If color2 is defined, then create a gradient for the colors.
  if (color2 !== undefined) {

    // Create gradients for the cube's faces.
    var barWidthPx = w.scaleX.toPx * width;
    var barHeightPx = w.scaleY.toPx * height;
    var ofxPx = w.scaleX.toPx * OFX;

    // Top gradients.
    cTop = w.ctx.createLinearGradient(ofxPx / 2, 0, barWidthPx, 0);
    cTop.addColorStop(0, shadeColor(color, 85)); cTop.addColorStop(1, shadeColor(color2, 85));
    cTopBorder = w.ctx.createLinearGradient(ofxPx / 2, 0, barWidthPx, 0);
    cTopBorder.addColorStop(0, shadeColor(color, 50)); cTopBorder.addColorStop(1, shadeColor(color2, 50));
    
    // Front gradients.
    cFront =  w.ctx.createLinearGradient(-barWidthPx / 2, -barHeightPx / 2, barWidthPx / 2, barHeightPx / 2);
    cFront.addColorStop(0, shadeColor(color, 75)); cFront.addColorStop(1, shadeColor(color2, 75));
    cFrontBorder =  w.ctx.createLinearGradient(-barWidthPx / 2, -barHeightPx / 2, barWidthPx / 2, barHeightPx / 2);
    cFrontBorder.addColorStop(0, shadeColor(color, 50)); cFrontBorder.addColorStop(1, shadeColor(color2, 50));

  } else {

    // Shades with color 1.
    cTop = shadeColor(color, 85);
    cRight = shadeColor(color, 80);
    cFront = shadeColor(color, 75);
    cFrontBorder = cTopBorder = cRightBorder = shadeColor(color, 50);

  }

  // Move to the desired position. The prism will be centered here.
  sim.save();
  sim.translate(x, y);
  
  // Draw the font facing rectangle.
  sim.fill(cFront);
  sim.stroke(cFrontBorder);
  sim.begin();
  sim.rect(-width/2, -height/2, width, height);
  sim.end();

  // Draw the top face.
  sim.translate(-width/2, height/2);
  sim.fill(cTop);
  sim.stroke(cTopBorder);
  sim.begin();
  sim.moveTo(0, 0);
  sim.lineTo(OFX, OFY);
  sim.lineTo(width+OFX, OFY);
  sim.lineTo(width, 0);
  sim.lineTo(0, 0);
  sim.end();
  
  // Draw the right face.
  sim.translate(width, -height);
  sim.fill(cRight);
  sim.stroke(cRightBorder);
  sim.begin();
  sim.moveTo(0, 0);
  sim.lineTo(OFX, OFY);
  sim.lineTo(OFX, height + OFY);
  sim.lineTo(0, height);
  sim.lineTo(0, 0)
  sim.end();

  sim.restore();
}

/**
 * Draws the simulation. This function is called automatically by the p$ lib.
 */
function drawSimulation() {


  
  // Move the simulation to the left to compensate for perspective offset.
  // Therby centering the drawing.
  sim.save();
  sim.translate(-OFX/2, 0);
  
  // Left block.
  draw3dRect(-barLength / 2 - BLOCK_W / 2, 0, BLOCK_W, BLOCK_W, t1Color);
  sim.font.set({ size: 14, color: FONT_COLOR });
  sim.text('T1', -barLength/2 - BLOCK_W/2, 0.3);
  sim.font.set({ size: 16, color: shadeColor(t1Color, 40) });
  sim.text(controls.t1.label.val(), -barLength/2 - BLOCK_W/2, -0.3);

  // Middle bar.
  draw3dRect(0, 0, barLength, barWidth, t1Color, t2Color);

  // Right block.
  draw3dRect(barLength / 2 + BLOCK_W / 2, 0, BLOCK_W, BLOCK_W, t2Color);
  sim.font.set({ size: 14, color: FONT_COLOR });
  sim.text('T2', barLength/2 + BLOCK_W/2, 0.3);
  sim.font.set({ size: 16, color: shadeColor(t2Color, 40) });
  sim.text(controls.t2.label.val(), barLength/2 + BLOCK_W/2, -0.3);
  
  // Restore the offset.
  sim.restore();
  
  // Draw arrow.
  if (heatTransfer !== 0) {
    sim.save();
    sim.fill(p$.BOX_COLORS.ORANGE.BACKGROUND);
    sim.stroke(p$.BOX_COLORS.ORANGE.BORDER);
    sim.translate(0, 2.5);
    if (heatTransfer < 0) sim.rotate(-180);

    // Draw the arrow tip.
    sim.equilateralTriangle(arrowBodyW + ARROW_HEAD_H / 2, 0, ARROW_HEAD_L, 0);

    // Draw the arrow body. The body is shifted slightly to cover the stroke of the arrow
    // head.
    sim.begin();
    sim.moveTo(arrowBodyW + 0.01, -ARROW_BODY_H/2);
    sim.lineTo(0, -ARROW_BODY_H/2);
    sim.lineTo(0, ARROW_BODY_H/2);
    sim.lineTo(arrowBodyW + 0.01, ARROW_BODY_H/2);
    sim.end();

    // Display the heat label only if there is space.
    if (arrowBodyW > 0.5) {
      // Rotate the label according to the heat direction.
      sim.translate(arrowBodyW / 2, 0);
      if (heatTransfer < 0) sim.rotate(-180);   
      sim.font.set({ size: 12, color: p$.BOX_COLORS.ORANGE.BORDER });
      sim.text("calor", 0, 0);
    }

    sim.restore();
  }
  
}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height * 5 / 8);
  results.setPosition(20, 20);
}
