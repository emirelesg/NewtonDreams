// Constants
var DT = 0.0000005;
var HE_MASS = 4.002602/1000;            // In kg/mol.
var AR_MASS = 39.948/1000;              // In kg/mol.
var MIN_PARTICLE_R = 0.03;              // Radius in cm of the particle.
var N_SCALE_FACTOR = 6E18;              // Scale the amount of particles by this amount.
var PISTON_BASE_H = 0.4;
var PISTON_EXT_W = 0.4;
var PISTON_EXTENSION_H = 10;            // Units that the piston is extended.
var HIST_BINS = 20;                     // Amount of bins or bars in the histogram.
var HIST_MAX = 0;                       // Maximum value the histogram can extend.
var HIST_BIN_WIDTH = 0;                 // Division between the the maximum value and the amount of bins.

// Particle object. Saves the position and the velocity of every particle.
var Particle = function(box_dimensions, speed, mass) {
  this.x = Math.random() * box_dimensions;
  this.y = Math.random() * box_dimensions;
  this.max_speed = speed;
  this.v = new p$.Vector();
  this.v.setMag(speed, 360 * Math.random());
  this.r = MIN_PARTICLE_R * controls.size.value;
  this.color = p$.COLORS.PURPLE;
  this.mass = mass;
}

// Variables
var box_l = 4.6415;                     // Dimensions of the box in cm.
var box_v = 0;                          // Volume of the box.
var box_l_target = 0;                   // Desired dimensions of the box.
var particles = [];                     // Empty array with all of the particles.
var max_possible_speed = 0;             // Calculate the max possible speed a particle could have. Depends on temp.
var mass_argon = AR_MASS/p$.AVOGADRO;   // Mass of a single particle of Argon.
var mass_helium = HE_MASS/p$.AVOGADRO;  // Mass of a single particle of Helium.
var bins = [];                          // Histogram bins.

// p$ Objects
var w;
var dc = new p$.DataCursor({ constant: true });
var results = new p$.Box( { debug: false, title: "Resultados", isDraggable: false, color: p$.BOX_COLORS.BLUE } )
var box = new p$.Box( { debug: false, title: "Histograma", isDraggable: false } );
var graph = undefined;
var histogram = undefined;
var controls = {};
var labels = {};
var scene = new p$.Shape(drawScene);

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
  w.axis.draggable(false);
  w.axis.display = false;

  // Define background.
  w.background.setCallback(function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = p$.BOX_COLORS.GRAY.BACKGROUND;
    ctx.rect(0, 0, w.width, w.height);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = p$.COLORS.BROWN;
    ctx.rect(0, w.axis.position.y, w.width, w.height - w.axis.position.y);
    ctx.fill();
  });

  // Configure histogram plot.
  graph = box.addGraph(200, 175, {});
  graph.setLabels("", "Velocidad [m/s]", "Cantidad");
  graph.setPosition(0, 20);
  graph.scaleX.set(35, 200);
  graph.scaleY.set(35, -15);
  graph.axis.outsideNumbers = true;
  graph.setPadding(10, 10, 40, 40);
  histogram = graph.addPlot({ color: p$.COLORS.BLUE, style: "histogram", binWidth: 7 });

  // Configure labels.
  labels.vel = results.addLabel(150, 14, { name: "Velocidad: ", units: "m/s", labelWidth: 100, decPlaces: 2 });
  labels.vel.setPosition(0, 25);
  labels.pressure = results.addLabel(150, 14, { name: "Presión: ", units: "atm", labelWidth: 100, decPlaces: 2 });
  labels.pressure.setPosition(0, 50);
  results.calculateDimensions();

  // Add plots to data cursor.
  dc.add(histogram);

  // Configure the z index of all objects.
  scene.setZ(1);
  box.setZ(2);
  results.setZ(3);
  dc.setZ(4);

  // Add objects to world.
  w.add(scene, box, results, dc);

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.size = new p$.Slider({ id: "size", start: 1.2, min: 1, max: 2, decPlaces: 1, units: "x", callback: reset, color: p$.COLORS.RED });
  controls.amount = new p$.Slider({ id: "amount", start: 200, min: 1, max: 400, decPlaces: 0, units: "", callback: reset, color: p$.COLORS.GREEN });
  controls.temperature = new p$.Slider({ id: "temperature", start: 300, min: 0, max: 1000, decPlaces: 0, units: "°K", callback: reset, color: p$.COLORS.BLUE });
  controls.volume = new p$.Slider({ id: "volume", start: 100, min: 30, max: 125, decPlaces: 0, units: "cm³", callback: reset, color: p$.COLORS.YELLOW });

}

/**
 * Set the initial state of all variables.
 * Called when any slider changes values.
 */
function reset() {

  // Calculate the desired dimensions for the box.
  box_v = controls.volume.value * p$.CM3_TO_M3;
  box_l_target = Math.pow(controls.volume.value * p$.CM3_TO_M3, 1/3) * p$.M_TO_CM;

  // Calculate the maximum possible speed for a particle.
  max_possible_speed = p$.utils.round(Math.sqrt(3 * p$.BOLTZMANN * controls.temperature.value / mass_argon), 0);

  // Update the parameters of all particles.
  for (var i = 0; i < particles.length; i++) {

    // Update the raidus of the particle to match the slider.
    particles[i].r = MIN_PARTICLE_R * controls.size.value;

    // Update the particle's velocity. If the velocity is 0 then change to a random
    // direction.
    if (particles[i].max_speed !== max_possible_speed) {
      if (particles[i].v.mag() < 0.1) {
        particles[i].v.setMag(max_possible_speed, 360 * Math.random());
      } else {
        particles[i].v.setMag(max_possible_speed, particles[i].v.angle());
      }
      particles[i].max_speed = max_possible_speed;
    }

  }

  // Set velocity label.
  labels.vel.set(max_possible_speed);

}

/**
 * Draw the main scene with the particles and the box.
 */
function drawScene() {

  /**
   * Returns a gradient taking into account the zero coordinates.
   */

  function getGradient(x0, y0, x1, y1) {
    
    // Calculate the gradient for the box. It is required to calculate it
    // in pixels.
    var x0_px = x0 * w.scaleX.toPx;
    var y0_px = y0 * w.scaleY.toPx;
    var gradient = w.ctx.createLinearGradient(
        x0_px,
        y0_px,
        x0_px + x1 * w.scaleX.toPx,
        y0_px + y1 * w.scaleY.toPx
      );
    gradient.addColorStop(0, "#888888");
    gradient.addColorStop(0.5, "#DDDDDD");
    gradient.addColorStop(1, "#888888");
    return gradient;
  }

  // Draw the particles.
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    scene.fill(p.color);
    scene.noStroke();
    scene.arc(p.x, p.y, p.r, 0, 360);
  }

  // Draw box.
  scene.strokeWeight(2);
  scene.noFill();
  scene.stroke("#888");
  scene.rect(0, 0, box_l, box_l);

  // Draw vertical piston.
  scene.fill(getGradient(0, 0, box_l, 0));
  scene.rect(0, box_l, box_l, PISTON_BASE_H);
  scene.rect(box_l / 2 - PISTON_EXT_W / 2, box_l + PISTON_BASE_H, PISTON_EXT_W, PISTON_EXTENSION_H);

  // Draw horizontal piston.
  scene.fill(getGradient(0, 0, 0, box_l));
  scene.rect(box_l, 0, PISTON_BASE_H, box_l);
  scene.rect(box_l + PISTON_BASE_H, box_l / 2 - PISTON_EXT_W / 2, PISTON_EXTENSION_H, PISTON_EXT_W);

}

/**
 * Function gets called 60x per second.
 */
function draw() {

  /**
   * Update the position of the particles using the velocity.
   */
  function updatePosition(p) {
    p.x += (p.v.x * DT) * p$.M_TO_CM;
    p.y += (p.v.y * DT) * p$.M_TO_CM;
  }

  /**
   * Handle simple collisions between the walls of the container.
   */
  function bounceWall(p) {

    // Right wall
    if (p.x > box_l - p.r) {
      p.v.x *= -1;
      p.x = box_l - p.r;
    }

    // Left wall
    if (p.x < p.r) {
      p.v.x *= -1;
      p.x = p.r;
    }

    // Top wall
    if (p.y > box_l - p.r) {
      p.v.y *= -1;
      p.y = box_l - p.r;
    }

    // Bottom wall
    if (p.y < p.r) {
      p.v.y *= -1;
      p.y = p.r;
    }
    
  }

  /**
   * Handles the collisions between p1 and p2. 
   */
  function checkCollision(p1, p2) {

    // Distance between the particles
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var d = Math.sqrt(dx * dx + dy * dy);

    // If particles have collided
    if (d <= p1.r + p2.r) {

      // Normal unit vector
      var en = {
        i: dx/d,
        j: dy/d
      };

      // Tangential unit vector
      var et = {
        i: -en.j,
        j: en.i
      };

      // Move the second particle along the normal unit vector 2r so that the 
      // particles are not touching any more
      p2.x = p1.x + (p1.r + p2.r) * en.i;
      p2.y = p1.y + (p1.r + p2.r) * en.j;

      // Calculate the normal and tangential velocities of p1
      var v1n = en.i * p1.v.x + en.j * p1.v.y;
      var v1t = et.i * p1.v.x + et.j * p1.v.y;

      // Calculate the normal and tangential velocities of p2
      var v2n = en.i * p2.v.x + en.j * p2.v.y;
      var v2t = et.i * p2.v.x + et.j * p2.v.y;

      // Calculate the new velocities
      var new_v1n = (v1n * (p1.mass - p2.mass) + 2 * p2.mass * v2n) / (p1.mass + p2.mass);
      var new_v2n = (v2n * (p2.mass - p1.mass) + 2 * p1.mass * v1n) / (p1.mass + p2.mass);

      // Combine the new velocities to form the v1 vector
      p1.v.x = new_v1n * en.i + v1t * et.i;
      p1.v.y = new_v1n * en.j + v1t * et.j;

      // Combine the new velocities to form the v2 vector
      p2.v.x = new_v2n * en.i + v2t * et.i;
      p2.v.y = new_v2n * en.j + v2t * et.j;

    }

  }

  // Handle the number of particles in the animation.
  if (particles.length > controls.amount.value) {
    particles.pop(particles.length - 1);
  } else if (particles.length < controls.amount.value) {
    particles.push(new Particle(box_l, max_possible_speed, mass_argon));
    particles[0].color = p$.COLORS.RED;
    if (particles.length > 1) particles[1].color = p$.COLORS.RED;
  }

  // Clear histogram.
  bins = []
  histogram.clear();

  // Interate through every particle.
  for (var i = 0; i < particles.length; i++) {
    
    // Dynamics of the particle.
    updatePosition(particles[i]);
    bounceWall(particles[i]);
    for (var j = 0; j < particles.length; j++) {
      if (j != i) checkCollision(particles[i], particles[j]);
    }

    // Calculate to which bin does the velocity belong.
    var idx = Math.floor(particles[i].v.mag() / HIST_BIN_WIDTH);
    if (idx < HIST_BINS) {

      // If the bin is empty then it's important to initialize it.
      if (!isFinite(bins[idx])) {
        bins[idx] = 1;
      } else {
        bins[idx] += 1
      }

    };

  }

  // Plot histogram.
  // Calculate the maximum height possible with the dimensions of the axis.
  var max_h = Math.abs(graph.axis.height * graph.scaleY.toUnits);
  for (var i = 0; i < HIST_BINS; i++) {

    // If bin was not initialized then use 0.
    var frequency = isFinite(bins[i]) ? bins[i] : 0;

    // Limit the frequency to the maximum height.
    if (frequency > max_h) frequency = max_h;

    // Add a point to the histogram centered around the bin width / 2.
    histogram.addPoint(i * HIST_BIN_WIDTH + HIST_BIN_WIDTH / 2, frequency);

  }

  // Handle the changes of the box target.
  var box_l_diff = box_l_target - box_l;
  if (Math.abs(box_l_diff) < 0.01) {  // If the difference is small update directly the target.
    box_l = box_l_target;   
  } else if (box_l_diff > 0) {        // Target is larger.
    box_l += 0.01;
  } else if (box_l_diff < 0) {        // Target is smaller.
    box_l -= 0.01;
  }

  // Calculate the pressure of the system and update the label.
  var amount = particles.length * N_SCALE_FACTOR;
  var pressure = (mass_argon * amount * max_possible_speed * max_possible_speed) / (3 * box_v);
  labels.pressure.set(pressure * p$.PA_TO_ATM);

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  
  // Position axis on the bottom left corner.
  w.axis.setPosition(0, w.height - 10);

  // If width > 350px display graph box.
  if (w.width > 350) {
    
    // Activate the graph box.
    box.display = true;
    graph.setDimensions(w.width / 2, 175);
    
    // Set box on the top right corner.
    box.calculateDimensions();
    box.setPosition(w.width - box.width - 20, 20);

    // Position results box on top right corner.
    results.calculateDimensions();
    results.setPosition(w.width - results.width - 20, box.height + 40);

  } else {

    // Hide the graph box.
    box.display = false;

    // Position results box on top right corner.
    results.calculateDimensions();
    results.setPosition(w.width - results.width - 20, 20);

  }

  // Fix the amount of bins to fill the entire x axis.
  HIST_MAX = graph.axis.width * graph.scaleX.toUnits;
  HIST_BIN_WIDTH = HIST_MAX / HIST_BINS;

  // Make sure there is a 4 pixel gap between bins.
  histogram.binWidth = graph.axis.width / HIST_BINS - 4;

}
