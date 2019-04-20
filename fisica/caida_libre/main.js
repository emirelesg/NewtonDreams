// Constants

// Variables
var t = 0;                // Current time in seconds.
var t_final = 0;          // Final time to reach y = 0.
var t_max = 0;            // Time where the ball reaches the highest point.
var started = false;      // Has the start button been pressed?
var vy0 = 0;              // Initial y velocity.
var y0 = 0;               // Initial height.

// p$ Objects
var w;
var box = new p$.Box( { debug: false, title: "Movimiento de la Particula", isDraggable: false } );
var ball = new p$.Ball(2.5, { color: p$.COLORS.BLUE, isDraggable: false });
var vel = new p$.Vector( { color: p$.COLORS.PURPLE, components: true } );
var controls = {};
var graph = undefined;
var path = undefined;

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
  w.scaleX.set(50, 10, 'm');
  w.scaleY.set(50, -10, 'm');

  // Configure graph plot.
  graph = box.addGraph(300, 200, {});
  graph.setLabels("", "Tiempo [s]", "Altura [m]");
  graph.setPosition(0, 20);
  graph.scaleY.set(35, -15, '');
  graph.scaleX.set(35, 1, '');
  path = graph.addPlot( { color: p$.COLORS.BLUE } );
  box.calculateDimensions();

  // Configure the z index of all objects.
  box.setZ(3);
  ball.setZ(2);
  vel.setZ(1);

  // Add objects to world.
  w.add(ball, vel, box);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.y0 = new p$.Slider({ id: "y0", start: 25, min: 0, max: 25, decPlaces: 1, units: "m", callback: reset });
  controls.v0 = new p$.Slider({ id: "v0", start: 15, min: -30, max: 30, decPlaces: 1, units: "m/s", callback: reset, color: p$.COLORS.GREEN });

  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    reset();
    started = true;
  });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Reset time and simulation.
  t = 0;
  started = false;

  // Clear path.
  path.clear();

  // Reset main ball and vector.
  vel.setMag(controls.v0.value, 90);
  vel.setPosition(0, controls.y0.value);
  ball.setPosition(0, controls.y0.value);

  // Save initial values.
  vy0 = vel.y;
  y0 = ball.position.y;

  // Using the quadratic formula get the positive solution to the time
  // the ball takes to reach ground again.
  var t1 = (-vy0 + Math.sqrt(vy0 * vy0 - 4 * (-9.81/2) * y0)) / (-9.81);
  var t2 = (-vy0 - Math.sqrt(vy0 * vy0 - 4 * (-9.81/2) * y0)) / (-9.81);
  t_final = t1 > 0 ? t1 : t2;

  // Calculate at which time the ball is at its highest.
  t_max = vy0 / 9.81;

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  // Only calculate animation if it has started.
  if (started) {

    // Calculate the current y velocity.
    var vy = vy0 - 9.8 * t;

    // Calculate the current y position.
    var y = y0 + vy0 * t - 0.5 * 9.8 * t * t;

    // Set psoition and velocity to ball and vectors.
    vel.set(0, vy);
    ball.setPosition(0, y);
    vel.setPosition(ball.position.x, ball.position.y);

    // If ball has reached maximum height create a marker.
    if (t >= t_max && path.markers.length === 0) {
      path.addMarker(t, ball.position.y, {
        label: t.toFixed(2) + "s", 
        lower_label: y.toFixed(2) + "m",
        top: y < 60
      });
    }

    // Check if ball has reached ground.
    if (t < t_final) {
      t += 0.05;
    } else {

      // Add marker at the ground.
      path.addMarker(t, 0, {
        label: t.toFixed(2) + "s", 
        lower_label: "0m"
      });

      // Stop animation.
      started = false;

      // Set position to ground level.
      ball.setPosition(0, y0 + vy0 * t_final - 0.5 * 9.81 * t_final * t_final);
      vel.setPosition(ball.position.x, ball.position.y);

    }

    // Add y position of ball to plot.
    path.addPoint(t, ball.position.y);
    
  }
}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  // If width is less than 400px resize the box and move axis.
  if (w.width < 400) {
    w.axis.setPosition(50, w.height - 50);
    graph.setDimensions(200, 200);
    graph.scaleX.set(40, 2, '');
  } else {
    w.axis.setPosition(100, w.height - 50);
    graph.setDimensions(300, 200);
    graph.scaleX.set(35, 1, '');
  }

  // Update box dimensions and position.
  box.calculateDimensions();
  box.setPosition(w.width - box.width - 20, 20);
}
