// Constants
var PLANE_HYP = 7;                      // Constant hypothenuse of the plane.
var PULLEY_RADIUS = 0.5;                // Radius of the pulley.
var BOX_2_X_OFFSET = 0.4;               // Separation from the end of the plane and the hanging box.
var PLANE_BORDER = "#949494";           // Color of the plane's border.
var PLANE_BACKGROUND = "#D7D7D7";       // Color of the planes's background.
var PULLEY_LINK_COLOR = "#BABABA";      // Color of the link between plane and pulley.
var WEIGHT_VECTOR_SCALE_FACTOR = 1/20;  // Display scale for the box's weights.

// Objects
function Box() {
  /**
   * This object holds the properties for the hanging and sliding boxes.
   */
  this.x = 0;                           // Current x position. Used for the sliding box.
  this.y = 0;                           // Current y position. Used for the hanging box.
  this.vx = 0;                          // X speed. Used for the sliding box.
  this.vy = 0;                          // Y speed.
  this.ax = 0;                          // Acceleration x component.
  this.ay = 0;                          // Acceleration y component.
  this.mass = 0;                        // Mass of the hanging box.
  this.side = 0;                        // Side of the box.
  this.half_side = 0;                   // Half of the side of the box. Calculated to avoid recalculation.
  this.weight = 0;                      // Weight of the box in Newtons.
}

// Variables
var cos_a = 0;                          // Cosine of the plane's angle. Calculated to save calculation time.
var sin_a = 0;                          // Sine of the plane's angle. Calculated to save calculation time.
var plane_angle_rad = 0;                // Plane's angle in radians.
var plane_angle_deg = 0;                // Plane's angle in degrees.
var plane_width = 0;                    // Width of the plane.
var plane_height = 0;                   // Height of the plane.
var plane_x0 = 0;                       // Starting position of the plane. Calculated to be centered on the canvas.
var pulley_y = 0;                       // Y position of the pulley's center.
var pulley_x = 0;                       // X position of the pulley's center.
var box1 = new Box();                   // Sliding box.
var box2 = new Box();                   // Hanging box.
var force = 0;                          // Net force of the system.
var accel = 0;                          // Magnitude of the system's acceleration.
var tension = 0;                        // Tension of the system.
var started = false;                    // Has the animation started?
var t = 0;                              // Time of the animation.
var show_vectors = true;                // Show the vectors of the masses.

// p$ Objects
var w;
var results = new p$.Box( {debug: false, isDraggable: false, title: "Resultados" } );
var scene = new p$.Shape(drawScene);    // Creates the plane and its objects.
var labels = {};                        // All display labels are here.
var controls = {};                      // All dom controls are here.

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
  w.axis.isDraggable = false;
  w.background.setCallback(drawBackground);     // Call background to draw sky and grass.

  // Configure result box.
  labels.accel = results.addLabel(160, 14, { name: "Acceleración", units: "m/s²", labelWidth: 100, decPlaces: 1 })
  labels.accel.setPosition(0, 25);
  labels.tension = results.addLabel(160, 14, { name: "Tensión", units: "N", labelWidth: 100, decPlaces: 1 })
  labels.tension.setPosition(0, 50);
  results.calculateDimensions();

  // Configure the z index of all objects.
  scene.setZ(1);
  results.setZ(3);

  // Add objects to world.
  w.add(scene, results);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.angle = new p$.Slider({ id: "angle", start: 40, min: 20, max: 60, decPlaces: 0, units: "°", callback: reset, color: p$.COLORS.RED });
  controls.mass1 = new p$.Slider({ id: "mass1", start: 3, min: 1, max: 5, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.GREEN });
  controls.mass2 = new p$.Slider({ id: "mass2", start: 3, min: 1, max: 5, decPlaces: 1, units: "kg", callback: reset, color: p$.COLORS.YELLOW });
  
  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    reset();
    setTimeout(function() {
      started = true;
    }, 200);
  });

  // Show vector option.
  controls.show_vectors = new p$.dom.Option("showVectors", function(c) {
    show_vectors = c;
  });
  
}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset(reason) {

  // Obtain the plane's angle.
  plane_angle_deg = controls.angle.value;
  plane_angle_rad = plane_angle_deg * p$.DEG_TO_RAD;
  
  // Calculate sin and cos to avoid recalculation.
  cos_a = Math.cos(plane_angle_rad);
  sin_a = Math.sin(plane_angle_rad);
  
  // Update plane's dimensions.
  plane_width = PLANE_HYP * cos_a;
  plane_height = PLANE_HYP * sin_a;

  // Update pulley's position.
  pulley_x = plane_width + PULLEY_RADIUS * cos_a;
  pulley_y = plane_height + PULLEY_RADIUS * sin_a;
  
  // Get box mass and calculate weight and dimensions of box based on density.
  box1.mass = controls.mass1.value;
  box1.weight = box1.mass * 9.81;
  box1.side = Math.pow(box1.mass / 4, 1 / 3);
  box1.half_side = box1.side / 2;

  // Position box at the center of the plane.
  box1.x = (PLANE_HYP - box1.side) / 2;

  // Get box mass and calculate weight and dimensions of box based on density. 
  box2.mass = controls.mass2.value;
  box2.weight = box2.mass * 9.81;
  box2.side = Math.pow(box2.mass / 4, 1/3);
  box2.half_side = box2.side / 2;

  // Position box at the middle of the plane.
  box2.y = pulley_y - box2.side - plane_height / 2;

  // Calculate system's acceleration and tension.
  accel = (box1.weight * sin_a - box2.weight) / (box2.mass + box1.mass);
  tension = box2.mass * (9.81 - accel);

  // Center plane horizontally in the canvas.
  plane_x0 = (w.width * w.scaleX.toUnits - plane_width - box2.side) / 2;

  // Set acceleration of boxes.
  box1.ax = -accel;
  box2.ay = accel;
  
  // Reset boxes' velocities.
  box1.vx = 0;
  box2.vy = 0;

  // Stop any simulations running and reset time counter.
  t = 0;
  started = false;

  // Set display labels.
  labels.accel.set(accel);
  labels.tension.set(tension);

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Only run if user has pressed the start button.
  if (started) {

    // Update time.
    t += 0.0025;

    // Motion equations for box 1.
    box1.vx += box1.ax * t;
    box1.x += box1.vx * t + box1.ax * t * t / 2;

    // Motion equations for box 2.
    box2.vy += box2.ay * t;
    box2.y += box2.vy * t + box2.ay * t * t / 2;

    // Box 1 hits the ground.
    if (box1.x < 0) {
      started = false;
      box1.x = 0;
    }

    // Box 1 hits pulley.
    if (box1.x > PLANE_HYP - box1.side) {
      started = false;
      box1.x = PLANE_HYP - box1.side;

    }

    // Box 2 hits the ground.
    if (box2.y < 0) {
      started = false;
      box2.y = 0;
    }

    // Box 2 hits pulley.
    if (box2.y > pulley_y - box2.side - PULLEY_RADIUS) {
      started = false;
      box2.y = pulley_y - box2.side - PULLEY_RADIUS;
    }

  }

}

/**
 * Function draws the scene. This includes pulley, inclined plane, boxes,
 * and vectors.
 */
function drawScene() {

  function drawInclinedPlane() {
    /**
     * Function draws the inclined plane.
     */

    scene.fill("#cfd8dc");
    scene.stroke(PLANE_BORDER);
    scene.triangle(
      0, 0,
      plane_width, 0,
      plane_width, plane_height
    );

  }

  function drawSlidingMass() {
    /**
     * Draw sliding mass (box 1). Draws also acceleration arrow, as well as
     * weight vectors.
     */

    // Save canvas state and rotate.
    scene.save();
    scene.translate(box1.x * cos_a, box1.x * sin_a);
    scene.rotate(plane_angle_deg);

    // Sliding box wire.
    scene.fill(PLANE_BACKGROUND);
    scene.stroke(PLANE_BORDER);
    scene.strokeWeight(2);
    scene.line(0, box1_wire_y, PLANE_HYP - box1.x + PULLEY_RADIUS, box1_wire_y);

    // Sliding box accel vector.
    scene.fill(p$.COLORS.RED);
    scene.stroke(p$.COLORS.RED);
    scene.vector(box1_accel_x0, box1_accel_y0, box1_accel_x1, box1_accel_y0);
    scene.text(labels.accel.value, (box1_accel_x0 + box1_accel_x1) / 2, box1_accel_y0 + 0.3)

    // mg vector.
    if (show_vectors) {
      var weight = -box1.weight * WEIGHT_VECTOR_SCALE_FACTOR;
      scene.vectorFromMag(box1.half_side, box1.half_side, weight * sin_a, 0, p$.COLORS.GRAY, true);
      scene.vectorFromMag(box1.half_side, box1.half_side, weight * cos_a, 90, p$.COLORS.GRAY, true);
      var pos = scene.vectorFromMag(box1.half_side, box1.half_side, weight, 90 - plane_angle_deg, p$.COLORS.GREEN);
    }

    // Sliding box.
    scene.fill(p$.BOX_COLORS.GREEN.BACKGROUND);
    scene.stroke(p$.BOX_COLORS.GREEN.BORDER);
    scene.strokeWeight(1);
    scene.rect(0, 0, box1.side, box1.side);
    scene.text(box1.mass + "kg", box1.half_side, box1.half_side);
    
    // mg vector label.
    if (show_vectors) {
      scene.translate(pos[0], pos[1]);
      scene.rotate(-plane_angle_deg);
      scene.text("m1*g", 0, -0.3);
    }

    scene.restore();

  }

  function drawHangingMass() {
    /**
     * Draw the hanging mass (box 2) and its wire connecting it to the pulley.
     * Also draws the weight vector.
     */

    // Draw hanging box wire.
    scene.fill(PLANE_BACKGROUND);
    scene.stroke(PLANE_BORDER);
    scene.strokeWeight(2);
    scene.line(box2_wire_x, pulley_y, box2_wire_x, box2.y);

    // mg vector
    if (show_vectors) {
      var weight = -box2.weight * WEIGHT_VECTOR_SCALE_FACTOR;
      var pos = scene.vectorFromMag(pulley_x + box2.half_side, box2.y + box2.half_side, weight, 90, p$.COLORS.YELLOW);
      scene.text("m2*g", pos[0], pos[1] -0.3);
    }
    
    // Draw hanging box.
    scene.fill(p$.BOX_COLORS.YELLOW.BACKGROUND);
    scene.stroke(p$.BOX_COLORS.YELLOW.BORDER);
    scene.strokeWeight(1);
    scene.rect(pulley_x, box2.y, box2.side, box2.side);
    scene.text(box2.mass + "kg", pulley_x + box2.half_side, box2.y + box2.half_side);

  }

  function drawPulley() {
    /**
     * Draws the pulley at the edge of the plane. Includes the link between pulley and
     * inclined plane.
     */

    scene.save();
    scene.strokeWeight(1);
    scene.fill(PLANE_BACKGROUND);
    scene.stroke(PLANE_BORDER);
    scene.translate(pulley_x, pulley_y);

    // Pulley.
    scene.rotate(plane_angle_deg + 10);
    scene.arc(0, 0, PULLEY_RADIUS, 0, 360);

    // Pulley arm.
    scene.stroke(PULLEY_LINK_COLOR);
    scene.strokeWeight(15);
    scene.line(0, 0, -PULLEY_RADIUS * 1.5, 0);

    // Pulley bolt.
    scene.strokeWeight(2);
    scene.arc(0, 0, 0.08, 0, 360);
    scene.restore();

  }

  // Calculations for positioning the wires and the acceleration vector.
  var box1_wire_y = (box1.half_side) > PULLEY_RADIUS ? PULLEY_RADIUS : (box1.half_side);
  var box2_wire_x = (box2.half_side) > PULLEY_RADIUS ? pulley_x + PULLEY_RADIUS : pulley_x + (box2.half_side);  
  var box1_accel_y0 = box1.side + 0.25;
  var box1_accel_x0 = box1.half_side;
  var box1_accel_x1 = box1_accel_x0 + box1.ax / 2;

  // Drawing sequence.
  scene.save();
  scene.translate(plane_x0, 0);
  drawInclinedPlane();
  drawSlidingMass();
  drawHangingMass();
  drawPulley();
  scene.restore();
  
}

/**
 * Draws background. Uses a different canvas element and is prerendered.
 * It only needs to be drawn once unless a change occurs.
 */
function drawBackground(ctx) {

  // Creates sky gradient.
  var gradient = ctx.createLinearGradient(0, 0, 0, w.axis.position.y);
  gradient.addColorStop(0,"#81CCFE");
  gradient.addColorStop(1,"#EFFDFE");
  
  // Draws sky.
  ctx.beginPath();
  ctx.fillStyle = gradient;
  ctx.rect(0, 0, w.width, w.axis.position.y);
  ctx.fill();
  ctx.closePath();

  // Draws grass.
  ctx.beginPath();
  ctx.fillStyle = p$.COLORS.GREEN;
  ctx.rect(0, w.axis.position.y, w.width, w.height - w.axis.position.y);
  ctx.fill();
  ctx.closePath();

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  if (w.width < 400) {
    w.scaleX.set(50, 1.3, '');
    w.scaleY.set(50, -1.3, '');
  } else {
    w.scaleX.set(50, 1, '');
    w.scaleY.set(50, -1, '');
  }

  w.axis.setPosition(0, w.height - 10);
  results.setPosition(20, 20);
  reset();
}
