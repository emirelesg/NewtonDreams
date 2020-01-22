// Constants
var TIME_STEP = 0.05;       // Step of time every iteration of the draw function.
var BALL_AMOUNT = 4;              // Amount of balls.

// Variables
var vx0 = 0;                // Initial x velocity.
var points = [];            // 2d array with the values of the simulation.
var current = 0;            // Current step of the simulation.
var started = false;        // Determines if the simulations is running.
var showRefPoints = false;

// p$ Objeccts
var w;
var ball_labels = new p$.Shape(drawBallLabels);
var ball = new p$.Ball(2.5, { color: p$.COLORS.BLUE, isDraggable: false });
var vel = new p$.Vector( { color: p$.COLORS.PURPLE, components: true } );
var path = new p$.Plot( { color: p$.COLORS.BLUE } );
var box = new p$.Box( { debug: false, title: "Resultados", isDraggable: false } );
var balls = [];         // Array of p$.Balls.
var labels = {};
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
  w.scaleX.set(50, 10, 'm');
  w.scaleY.set(50, -10, 'm');

  // Add steps amount of balls.
  // Creates an object with obj, time and vy property.
  for (var i = 0; i < BALL_AMOUNT; i++) {
    var b = new p$.Ball(2.5, { color: p$.COLORS.GRAY, display: true, isDraggable: false });
    b.setZ(3);
    b.display = false;
    balls.push({
      obj: b,
      t: 0,
      vy: 0
    });
    w.add(b);
  }

  // Configure box and add labels for vx and vy.
  labels.vx = box.addLabel(110, 14, { name: "Vx", units: "m/s", labelWidth: 35 });
  labels.vx.setPosition(0, 25);
  labels.vy = box.addLabel(110, 14, { name: "Vy", units: "m/s", labelWidth: 35 });
  labels.vy.setPosition(0, 50);
  labels.t = box.addLabel(110, 14, { name: "t", units: "s", labelWidth: 35 });
  labels.t.setPosition(0, 75);
  box.calculateDimensions();

  // Configure the z index of all objects.
  path.setZ(1);
  vel.setZ(2);
  ball.setZ(4);
  box.setZ(10);

  // Add objects to world.
  w.add(ball, vel, box, path, ball_labels);
}

/**
 * Setup DOM elements.
 */
function setupControls() {
  
  // // Configure sliders.
  controls.v0 = new p$.Slider({ id: "v0", start: 30, min: 20, max: 40, decPlaces: 1, units: "m/s", callback: reset, color: p$.COLORS.RED });
  controls.y0 = new p$.Slider({ id: "y0", start: 0, min: 0, max: 30, decPlaces: 0, units: "m", callback: reset, color: p$.COLORS.BLUE });
  controls.angle = new p$.Slider({ id: "angle", start: 40, min: 0, max: 90, decPlaces: 0, units: "°", callback: reset, color: p$.COLORS.GREEN });
  
  // Buttons.
  controls.start = new p$.dom.Button("start", function() {
    // Reset the simulation only if the simulation has ended.
    if (current >= points.length - 1) reset();
    started = true;
  });
  controls.pause = new p$.dom.Button("pause", function() {
    started = false;
  });
  controls.forward = new p$.dom.Button("forward", function() {
    started = false;
    current += 1;
    if (current >= points.length) current = points.length - 1;
  });
  controls.back = new p$.dom.Button("back", function() {
    started = false;
    current -= 1;
    if (current < 0) current = 0;
  });

  // Show points option.
  controls.showRefPoints = new p$.dom.Option("showPoints", function(s) {
    showRefPoints = s;
  });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Calculate the position and velocity of the projectile at a given time.
  function calc(t, vx0, vy0, y0) {
    return [
      t, 
      vx0 * t, 
      y0 + vy0 * t - 0.5 * 9.81 * t * t, 
      vy0 - 9.81 * t 
    ];
  }

  // Restart simulation.
  current = 0;
  started = false;

  // Save initial values.
  vel.setMag(controls.v0.value, controls.angle.value);
  var vy0 = vel.y;
  var y0 = controls.y0.value;
  vx0 = vel.x;
  
  // Using the quadratic formula get the positive solution to the time
  // the ball takes to reach ground again.
  var tFinal1 = (-vy0 + Math.sqrt(vy0 * vy0 - 4 * (-9.81/2) * y0)) / (-9.81);
  var tFinal2 = (-vy0 - Math.sqrt(vy0 * vy0 - 4 * (-9.81/2) * y0)) / (-9.81);
  var tFinal = tFinal1 > 0 ? tFinal1 : tFinal2;

  // Simulate the throw and store all points in the array.
  points = [];
  for (var t = 0; t <= tFinal; t += TIME_STEP) {
    points.push(calc(t, vx0, vy0, y0));
  }
  var resultTFinal = calc(tFinal, vx0, vy0, y0);
  points.push(resultTFinal);

  // Reference Ball 0 - t0
  balls[0].obj.setPosition(points[0][1], points[0][2]);
  balls[0].t = points[0][0];
  balls[0].vy = points[0][3];

  // Reference Ball 1 - tMax
  var tMax = vy0 / 9.81;
  var resultTMax = calc(tMax, vx0, vy0, y0);
  balls[1].obj.setPosition(resultTMax[1], resultTMax[2]);
  balls[1].t = resultTMax[0];
  balls[1].vy = resultTMax[3];

  // Reference Ball 2 - tFinal
  balls[2].obj.setPosition(resultTFinal[1], resultTFinal[2]);
  balls[2].t = resultTFinal[0];
  balls[2].vy = resultTFinal[3];

  // Reference Ball 3 - Cross y0 for a second time.
  if (y0 > 0) {
    var resultTy0 = calc(2 * tMax, vx0, vy0, y0);
    balls[3].obj.setPosition(resultTy0[1], resultTy0[2]);
    balls[3].t = resultTy0[0];
    balls[3].vy = resultTy0[3];
  } else {
    // Hide ball by moving it to (0, -1000).
    balls[3].obj.setPosition(0, -1000);
  }

}

/**
 * Draw function for Shape Object: ball_labels.
 */
function drawBallLabels() {
  for (var i = 0; i < balls.length; i++) {
    var b = balls[i];
    if (b.obj.display) {
      ball_labels.text("Vy: " + p$.utils.round(b.vy, 1) + " m/s", b.obj.position.x, b.obj.position.y + 4);
      ball_labels.text(p$.utils.round(b.t, 2) + " s", b.obj.position.x, b.obj.position.y + 8);
    }
  }
}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Get the current time, position, and velocity values.
  var t = points[current][0];
  var x = points[current][1], y = points[current][2];
  var vy = points[current][3];

  // Draw plot til the current point.
  path.clear();
  for (var i = 0; i < current; i++) {
    path.addPoint(points[i][1], points[i][2]);
  }

  // Draw reference balls til the current point.
  for (var i = 0; i < balls.length; i++) {
    balls[i].obj.display = t >= balls[i].t && showRefPoints;
  }

  // Update the position of the ball and velocity vector.
  ball.setPosition(x, y);
  vel.setPosition(x, y);
  vel.set(vx0, vy);

  // Update labels.
  labels.vx.set(vx0)
  labels.vy.set(vy);
  labels.t.set(t);
  
  // Increase current frame only if the simulation has not started.
  if (started) {
    if (current < points.length - 1) {
      current += 1;
    } else {
      started = false;
    }
  }

  // Update the control buttons, depending on the current frame.
  controls.back.enabled(current > 0);
  controls.forward.enabled(current < points.length - 1);
  controls.start.enabled(!started);
  controls.pause.enabled(started);

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  box.setPosition(w.width - box.width - 20, 20);
  w.axis.setPosition(50, w.height - 50);
}