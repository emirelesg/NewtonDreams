// Constants
var BLOCK_DENSITY = 0.25;                   // Block's density in kg / m³;
var ARROW_BODY_H = 0.3;                     // Height of the arrow's body.
var ARROW_HEAD_L = 0.8;                     // Side length of the arrow's head.
var ARROW_HEAD_H = ARROW_HEAD_L * p$.SIN60; // Height of the arrow's head.

// Variables
var started = false;                        // Flag for starting/stopping the simulation.
var block1 = { mass: 0, vx: 0, width: 0, x: 0, label: 'M1', color: p$.BOX_COLORS.RED };
var block2 = { mass: 0, vx: 0, width: 0, x: 0, label: 'M2', color: p$.BOX_COLORS.GREEN };

// p$ Objects
var w;
var s = new p$.Shape(drawScene);
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
  w.axis.display = false;
  w.background.setCallback(drawBackground);

  // Configure the z index of all objects.
  s.setZ(1);

  // Add objects to world.
  w.add(s);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.m1 = new p$.Slider({ id: "m1", start: 3, min: 0.1, max: 5, decPlaces: 1, units: "kg", callback: reset });
  controls.v1 = new p$.Slider({ id: "v1", start: 1, min: -5, max: 5, decPlaces: 1, units: "m/s", callback: reset });
  controls.m2 = new p$.Slider({ id: "m2", start: 3, min: 0.1, max: 5, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.GREEN });
  controls.v2 = new p$.Slider({ id: "v2", start: -1, min: -5, max: 5, decPlaces: 1, units: "m/s", callback: reset, color: p$.COLORS.GREEN });

  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    started = true;
  });
  controls.reset = new p$.dom.Button("reset", function() {
    reset();
  })
  
}

// Set the initial state of all variables.
function reset() {

  // Set the control's values to the block objects.
  block1.vx = controls.v1.value;
  block1.mass = controls.m1.value;
  block2.vx = controls.v2.value;
  block2.mass = controls.m2.value;

  // Calculate the blocks side.
  block1.width = Math.pow(block1.mass / BLOCK_DENSITY, 1/3);
  block2.width = Math.pow(block2.mass / BLOCK_DENSITY, 1/3);

  // Center the blocks for the collision.
  block2.x = 2;
  block1.x = -2 - block1.width;

  // Stop simulation.
  started = false;

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Enable controls.
  controls.start.enabled(!started);
  controls.reset.enabled(started);

  // Move blocks.
  if (started) {
    block1.x += block1.vx * 1.0 / 120.0;
    block2.x += block2.vx * 1.0 / 120.0;
  }

  // Collision check.
  if (block1.x + block1.width > block2.x) {

    // Separate blocks from their collision.
    block2.x = block1.x + block1.width

    // Store the block's velocities before modifying thier values.
    var v1x = block1.vx;
    var v2x = block2.vx;

    // Calculate new velocities.
    if (block1.mass === block2.mass) {
      
      // Same mass just changes the velocities.
      block1.vx = v2x;
      block2.vx = v1x;
      
    } else {
      
      // Conservation of momentum and kinetic energy.
      // https://en.wikipedia.org/wiki/Elastic_collision
      block1.vx = (block1.mass - block2.mass) * v1x + (2 * block2.mass) * v2x;
      block1.vx /= (block1.mass + block2.mass);   
      block2.vx = (2 * block1.mass) * v1x + (block2.mass - block1.mass) * v2x;
      block2.vx /= (block1.mass + block2.mass);

    }

  }

}

/**
 * Draws background. Uses a different canvas element and is prerendered.
 * It only needs to be drawn once unless a change occurs.
 */
function drawBackground(ctx) {

  // Creates sky gradient.
  var gradient = ctx.createLinearGradient(0, 0, 0, w.axis.position.y);
  gradient.addColorStop(1,"#EFFDFE");
  gradient.addColorStop(0,"#81CCFE");
  
  // Draws sky.
  ctx.beginPath();
  // ctx.fillStyle = p$.BOX_COLORS.GRAY.BACKGROUND;
  ctx.fillStyle = gradient;
  ctx.rect(0, 0, w.width, w.axis.position.y);
  ctx.fill();
  ctx.closePath();

  // Draws grass.
  ctx.beginPath();
  ctx.fillStyle = p$.COLORS.GRAY;
  ctx.rect(0, w.axis.position.y, w.width, w.height - w.axis.position.y);
  ctx.fill();
  ctx.closePath();

}

/**
 * Draws the blocks and arrows displaying their speeds.
 */
function drawScene() {
  
  function drawBlock(block) {
    
    // Sets the arrow's body length.
    const arrowBodyW = block.vx;

    // Draw block.
    s.fill(block.color.BACKGROUND);
    s.stroke(block.color.BORDER);
    s.rect(block.x, 0, block.width, block.width);

    // Block number.
    if (block.width > 1) {
      s.font.set({ size: 14, color: block.color.BORDER });
      s.text(block.label, block.x + block.width / 2, block.width / 2 + 0.3);
    }

    // Mass label.
    s.font.set({ size: 14, color: p$.FONT_COLOR });
    s.text(p$.utils.round(block.mass, 2) + " kg", block.x + block.width / 2, block.width > 1 ? block.width / 2 - 0.3 : block.width / 2);
    
    s.save();
    s.translate(block.x + block.width / 2, 3.5);
    s.fill(p$.BOX_COLORS.ORANGE.BACKGROUND);
    s.stroke(p$.BOX_COLORS.ORANGE.BORDER);
    
    // Draw the arrow head.
    if (block.vx <  0) {
      s.equilateralTriangle(arrowBodyW / 2 - ARROW_HEAD_H / 2, 0, ARROW_HEAD_L, 180);
    } else {
      s.equilateralTriangle(arrowBodyW / 2 + ARROW_HEAD_H / 2, 0, ARROW_HEAD_L, 0);
    }
    
    // Draw the arrow body.
    s.begin();
    s.moveTo(arrowBodyW / 2, -ARROW_BODY_H/2);
    s.lineTo(-arrowBodyW / 2, -ARROW_BODY_H/2);
    s.lineTo(-arrowBodyW / 2, ARROW_BODY_H/2);
    s.lineTo(arrowBodyW / 2, ARROW_BODY_H/2);
    s.end();
    
    // Draw speed label inside arrow.
    s.font.set({ size: 12, color: p$.BOX_COLORS.ORANGE.BORDER });
    s.text(p$.utils.round(block.vx, 2) + " m/s", 0, 0);

    s.restore();

  }

  drawBlock(block1);
  drawBlock(block2);

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  w.axis.setPosition(w.width / 2, w.height - 10);
}
