// Variables
var t = 0;                // Current time in seconds.
var t_final = 0;          // Final time to reach y = 0.
var t_max = 0;            // Time where the ball reaches the highest point.
var started = false;      // Has the start button been pressed?
var vx0 = 0;              // Initial x velocity.
var vy0 = 0;              // Initial y velocity.
var y0 = 0;               // Initial height.
var steps = 6;            // Amount of balls.
var show_balls = false;
var balls_i = 0;          // Amount of balls being currently displayed.

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
  for (var i = 0; i < steps; i++) {
    var b = new p$.Ball(2.5, { color: p$.COLORS.GRAY, display: false, isDraggable: false });
    b.setZ(2);
    balls.push({
      obj: b,
      time: 0,
      vy: 0
    });
    w.add(b);
  }

  // Configure box and add labels for vx and vy.
  labels.vx = box.addLabel(110, 14, { name: "Vx", units: "m/s", labelWidth: 35 });
  labels.vx.setPosition(0, 25);
  labels.vy = box.addLabel(110, 14, { name: "Vy", units: "m/s", labelWidth: 35 });
  labels.vy.setPosition(0, 50);
  box.calculateDimensions();

  // Configure the z index of all objects.
  vel.setZ(1);
  ball.setZ(2);
  box.setZ(10);

  // Add objects to world.
  w.add(ball, vel, box, path, ball_labels);
}

/**
 * Setup DOM elements.
 */
function setupControls() {
  
  // Configure sliders.
  controls.v0 = new p$.Slider({ id: "v0", start: 30, min: 20, max: 40, decPlaces: 1, units: "m/s", callback: reset, color: p$.COLORS.RED });
  controls.y0 = new p$.Slider({ id: "y0", start: 0, min: 0, max: 30, decPlaces: 0, units: "m", callback: reset, color: p$.COLORS.BLUE });
  controls.angle = new p$.Slider({ id: "angle", start: 40, min: 0, max: 90, decPlaces: 0, units: "°", callback: reset, color: p$.COLORS.GREEN });
  
  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    reset();
    started = true;
  });

  // Show points option.
  controls.show_points = new p$.dom.Option("showPoints", function(s) {
    displayBalls(s);
    show_balls = s;
  });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {
  // Hide all balls.
  balls_i = 0;
  for (var i = 0; i < steps; i++) {
    balls[i].obj.display = false;
    balls[i].obj.setPosition(0, 0);
    balls[i].obj.r = 0;
  }

  // Reset time and simulation.
  t = 0;
  started = false;

  // Reset graph.
  path.clear();
  
  // Reset main ball and vector.
  vel.setMag(controls.v0.value, controls.angle.value);
  vel.setPosition(0, controls.y0.value);
  ball.setPosition(0, controls.y0.value);

  // Save initial values.
  vx0 = vel.x;
  vy0 = vel.y;
  y0 = ball.position.y;
  
  // Reset labels.
  labels.vy.set(vy0);
  labels.vx.set(vx0);
  
  // Using the quadratic formula get the positive solution to the time
  // the ball takes to reach ground again.
  var t1 = (-vy0 + Math.sqrt(vy0 * vy0 - 4 * (-9.81/2) * y0)) / (-9.81);
  var t2 = (-vy0 - Math.sqrt(vy0 * vy0 - 4 * (-9.81/2) * y0)) / (-9.81);
  t_final = t1 > 0 ? t1 : t2;

  // Calculate at which time the ball is at its highest.
  t_max = vy0 / 9.81;
}

/**
 * Toggle the visibility of the balls.
 */
function displayBalls(state) {
  for (var i = 0; i < steps; i++) {
    balls[i].obj.display = state;
  }
}

/**
 * Draw function for Shape Object: ball_labels.
 */
function drawBallLabels() {
  for (var i = 0; i < steps; i++) {
    var b = balls[i];
    if (b.obj.display && b.obj.position.x !== 0) {
      ball_labels.text("Vy: " + p$.utils.round(b.vy, 1) + " m/s", b.obj.position.x, b.obj.position.y + 4);
      ball_labels.text(p$.utils.round(b.time, 1) + " s", b.obj.position.x, b.obj.position.y + 8);
    }
  }
}

/**
 * Function gets called 60x per second.
 */
function draw() {
  if (started) {
    var vy = vy0 - 9.8 * t;
    var x = vx0 * t;
    var y = y0 + vy0 * t - 0.5 * 9.8 * t * t;
    vel.set(vx0, vy);
    ball.setPosition(x, y);
    vel.setPosition(ball.position.x, ball.position.y);
    labels.vy.set(vy);
    if (t > (balls_i + 1) * t_final / steps && balls_i < steps && ball.position.x !== 0) {
      balls[balls_i].time = balls_i === 3 ? t_max : t;
      balls[balls_i].vy = balls_i === 3 ? 0 : vy;
      balls[balls_i].obj.display = show_balls;
      balls[balls_i].obj.r = 2;
      balls[balls_i].obj.setPosition(ball.position.x, ball.position.y);
      balls_i++;
    }
    if (t < t_final) {
      t += 0.05;
    } else {
      started = false;
      ball.setPosition(vx0 * t_final, y0 + vy0 * t_final - 0.5 * 9.81 * t_final * t_final);
      vel.setPosition(ball.position.x, ball.position.y);
      balls[balls.length - 1].obj.setPosition(ball.position.x, ball.position.y);
    }
    path.addPoint(ball.position.x, ball.position.y);
  }
}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  box.setPosition(w.width - box.width - 20, 20);
  w.axis.setPosition(50, w.height - 50);
}