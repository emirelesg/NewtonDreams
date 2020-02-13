// Constants
var OFX = 0.4;                              // Offset in the -x axis for the 3d perspective.
var OFY = 0.3;                              // Offset in the -y axis for the 3d perspective.
var BOX_LABEL_WIDTH = 70;                   // Width of labels in the result box.
var MIN_TEMP = -20, MAX_TEMP = 300;         // Define the temperature range.
var BLOCK_W = 1.5;                          // Width the blocks that will transfer heat.
var ARROW_BODY_H = 0.3;                     // Height of the arrow's body.
var ARROW_HEAD_L = 0.8;                     // Side length of the arrow's head.
var ARROW_HEAD_H = ARROW_HEAD_L * p$.SIN60; // Height of the arrow's head.
var OTHER_MATERIAL = 'Otro';                // Name of the other material.
var MATERIALS = {                           // Defines the K constants. The keys must match the values of the Radio buttons.
  'Otro': -1,
  'Madera': 0.1,
  'Concreto': 0.8,
  'Acero': 50.2
};

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

  // Configure sliders.
  controls.barLength  = new p$.Slider({ id: "bar_length", start: 2, min: 0.5, max: 3, decPlaces: 2, units: "m", callback: reset });
  controls.barArea    = new p$.Slider({ id: "bar_area", start: 0.20, min: 0.1, max: 1, decPlaces: 2, units: "m²", callback: reset, color: p$.COLORS.GREEN });
  controls.k          = new p$.Slider({ id: "k", start: 33, min: 0, max: 60, decPlaces: 1, units: "J/sm°C", callback: reset, color: p$.COLORS.BLUE });
  controls.t1         = new p$.Slider({ id: "t1", start: 102, min: MIN_TEMP, max: MAX_TEMP, decPlaces: 1, units: "°C", callback: reset });
  controls.t2         = new p$.Slider({ id: "t2", start: 31, min: MIN_TEMP, max: MAX_TEMP, decPlaces: 1, units: "°C", callback: reset });

  // Configure options.
  controls.material = new p$.dom.Options("material", function(o) {
    controls.k.set(o !== OTHER_MATERIAL ? MATERIALS[o] : controls.k.start);
  });
  controls.vertical = new p$.dom.Option("vertical");

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

// Set the initial state of all variables.
function reset() {

  // Match the slider to the material selected.
  if (MATERIALS[controls.material.value] !== controls.k.value) {
    if (controls.material.value === OTHER_MATERIAL) {
      for (material in MATERIALS) {
        if (MATERIALS[material] === controls.k.value) {
          controls.material.select(material);
          break;
        }
      }
    } else {
      controls.material.select(OTHER_MATERIAL)
    }
  }
  
  // Calculate the transfer of heat between both objects.
  heatTransfer = ((controls.k.value * controls.barArea.value) * (controls.t1.value - controls.t2.value)) / controls.barLength.value;
  labels.heatTransfer.set(heatTransfer);

  // Calculate the block's colors.
  if (controls.t1.value === controls.t2.value) {
    t1Color = [0,0,0];
    t2Color = [0,0,0];
  } else {
    t1Color = controls.t1.value > controls.t2.value ? [255,0,0] : [0,0,255];
    t2Color = controls.t1.value < controls.t2.value ? [255,0,0] : [0,0,255];
  }

  // Set the sliders' color.
  controls.t1.setColor(shadeColor(t1Color, 40));
  controls.t2.setColor(shadeColor(t2Color, 40));

  // Bar dimensions.
  barLength = controls.barLength.value;
  barWidth = Math.sqrt(controls.barArea.value);

  // Dimensions of the arrow.
  arrowBodyW = heatTransfer / 100;

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

  // Define the coordinates of the faces. The first element of the array, is the
  // starting position, all other elements are referenced to the starting position.
  var topCoords = [
    [x - width / 2, y + height / 2],
    [0, 0],
    [OFX, OFY],
    [width + OFX, OFY],
    [width, 0],
    [0, 0]
  ];
  var rightCoords = [
    [x + width / 2, y - height / 2],
    [0, 0],
    [OFX, OFY],
    [OFX, height + OFY],
    [0, height],
    [0, 0]
  ];
  var frontCoords = [
    [x - width / 2, y - height / 2],
    [0, 0],
    [0, height],
    [width, height],
    [width, 0],
    [0, 0]
  ];
  
  // If color2 is defined, then create a gradient for the colors.
  if (color2 !== undefined) {

    var barWidthPx  = w.scaleX.toPx * width;
    var barHeightPx = w.scaleY.toPx * height;

    // Vertical gradient.
    if (controls.vertical.value) {

      // Top gradients.
      cTop          = shadeColor(color2, 85);
      cTopBorder    = shadeColor(color2, 50);
      
      // Front gradients.
      cFront        =  w.ctx.createLinearGradient(0, 0, 0, barHeightPx);
      cFrontBorder  =  w.ctx.createLinearGradient(0, 0, 0, barHeightPx);
      cFront.addColorStop(0, shadeColor(color, 75)); cFront.addColorStop(1, shadeColor(color2, 75));
      cFrontBorder.addColorStop(0, shadeColor(color, 50)); cFrontBorder.addColorStop(1, shadeColor(color2, 50));      
      
      // Right gradients.
      cRight        = w.ctx.createLinearGradient(0, 0, 0, barHeightPx);
      cRightBorder  = cFrontBorder;
      cRight.addColorStop(0, shadeColor(color, 80)); cRight.addColorStop(1, shadeColor(color2, 80));

    // Horizontal gradient.
    } else {
      
      // Front gradients.
      cFront        =  w.ctx.createLinearGradient(0, 0, barWidthPx, 0);
      cFrontBorder  =  w.ctx.createLinearGradient(0, 0, barWidthPx, 0);
      cFront.addColorStop(0, shadeColor(color, 75)); cFront.addColorStop(1, shadeColor(color2, 75));
      cFrontBorder.addColorStop(0, shadeColor(color, 50)); cFrontBorder.addColorStop(1, shadeColor(color2, 50));      
      
      // Top gradients.
      cTop          = w.ctx.createLinearGradient(0, 0, barWidthPx, 0);
      cTopBorder    = cFrontBorder;
      cTop.addColorStop(0, shadeColor(color, 85)); cTop.addColorStop(1, shadeColor(color2, 85));
      
      // Right gradients.
      cRight        = shadeColor(color2, 80);
      cRightBorder  = shadeColor(color2, 50);

    }

  } else {

    // Shades with color 1.
    cTop          = shadeColor(color, 95);
    cRight        = shadeColor(color, 90);
    cFront        = shadeColor(color, 90);
    cFrontBorder  = cTopBorder = cRightBorder = shadeColor(color, 60);

  }
  
  // Function draws the a form using an array of coordinates.
  function drawFace(coords, fill, stroke, lineDash) {
    sim.save();
    sim.translate(coords[0][0], coords[0][1]);
    sim.lineDash(lineDash);
    sim.fill(fill);
    sim.stroke(stroke);
    sim.begin();
    for (let i = 1; i < coords.length; i++) {
      let x = coords[i][0];
      let y = coords[i][1];
      if (i === 1) {
        sim.moveTo(x, y);
      } else {
        sim.lineTo(x, y);
      }
    }
    sim.end();
    sim.restore();
  }

  // Draw the rectangle using the coordinates defined at the top.
  var lineDash = color2 ? 1 : 4;
  drawFace(frontCoords, cFront, cFrontBorder, lineDash)
  drawFace(topCoords, cTop, cTopBorder, lineDash);
  drawFace(rightCoords, cRight, cRightBorder, lineDash);

}

/**
 * Draws the simulation. This function is called automatically by the p$ lib.
 */
function drawSimulation() {

  // Filp the coordinates and lengths when the simulation is vertical.
  var x, y, bw, bl, materialPos, arrowPos, arrowRotation;
  if (controls.vertical.value) {
    x             = 0;
    y             = barLength / 2 + BLOCK_W / 2;
    bw            = barLength;
    bl            = barWidth;
    materialPos   = [-3, 0];
    arrowPos      = [2.7, 0];
    arrowRotation = 90;
  } else {
    x             = barLength / 2 + BLOCK_W / 2;
    y             = 0;
    bw            = barWidth,
    bl            = barLength;
    materialPos   = [0, -1.9];
    arrowPos      = [0, 2.2];
    arrowRotation = 0;
  }

  function drawCubes() {
    sim.save();
    sim.translate(-OFX / 2, 0);
    draw3dRect(-x, -y, BLOCK_W, BLOCK_W, t1Color);
    draw3dRect(0, 0, bl, bw, t1Color, t2Color);
    draw3dRect(x, y, BLOCK_W, BLOCK_W, t2Color);
    sim.font.set({ size: 14, color: p$.FONT_COLOR });
    sim.text('T2', x, y + 0.3);
    sim.text('T1', -x, -y + 0.3);
    sim.font.set({ size: 16, color: shadeColor(t2Color, 40) });
    sim.text(controls.t2.label.val(), x, y - 0.3);
    sim.font.set({ size: 16, color: shadeColor(t1Color, 40) });
    sim.text(controls.t1.label.val(), -x, -y - 0.3);
    sim.restore();
  }

  function drawMaterialLabel() {
    sim.save();
    sim.translate(materialPos[0], [materialPos[1]]);
    sim.font.set({ size: 14, color: p$.COLORS.GRAY })
    if (controls.material.value !== OTHER_MATERIAL) {
      sim.text(controls.material.value, 0, 0.2);
      sim.text("K = " + controls.k.label.val(), 0, -0.2);
    } else {
      sim.text("K = " + controls.k.label.val(), 0, 0);
    }
    sim.restore();
  }

  function drawHeatArrow() {
    if (heatTransfer !== 0) {
      sim.save();
      sim.fill(p$.BOX_COLORS.ORANGE.BACKGROUND);
      sim.stroke(p$.BOX_COLORS.ORANGE.BORDER);
      sim.translate(arrowPos[0], arrowPos[1]);
      sim.rotate(arrowRotation);
      
      // Draw the arrow tip.
      if (arrowBodyW > 0) {
        sim.equilateralTriangle(arrowBodyW + ARROW_HEAD_H / 2, 0, ARROW_HEAD_L, 0);
      } else {
        sim.equilateralTriangle(arrowBodyW - ARROW_HEAD_H / 2, 0, ARROW_HEAD_L, 180);
      }
    
      // Draw the arrow body. The body is shifted slightly to cover the stroke of the arrow
      // head.
      sim.begin();
      sim.moveTo(arrowBodyW, -ARROW_BODY_H/2);
      sim.lineTo(0, -ARROW_BODY_H/2);
      sim.lineTo(0, ARROW_BODY_H/2);
      sim.lineTo(arrowBodyW, ARROW_BODY_H/2);
      sim.end();
      
      // Display the heat label only if there is space.
      if (Math.abs(arrowBodyW) > 0.5) {
        sim.font.set({ size: 12, color: p$.BOX_COLORS.ORANGE.BORDER });
        sim.text("calor", arrowBodyW / 2, 0);
      }
      
      sim.restore();
    }
  }

  // Drawing sequence.
  drawCubes();
  drawMaterialLabel();
  drawHeatArrow();

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height - 175);
  results.setPosition(20, 20);
}
