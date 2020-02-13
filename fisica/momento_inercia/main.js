// Constants
var PLANE_BORDER = "#949494";           // Color of the plane's border.
var PLANE_BACKGROUND = "#D7D7D7";       // Color of the planes's background.

// Rolling object class.
var RollingObject = function(img) {
  this.display = true;                                        // Is the object enabled or not.
  this.img = new p$.Picture(img, { isDraggable: false });      // Picture object.
  this.r = 3;                                                 // Objects radius.
  this.time_label = "-";                                      // Label used to display time.
  this.place_label = "-";                                     // Label used to display the place it reached the end.
  this.accel = 0;                                             // Acceleration of the object rolling down
  this.x = 0;                                                 // X position of the object
  this.y = 0;                                                 // Y position of the object 
  this.theta = 0;                                             // Angle the object has rotated
  this.d = 0;                                                 // Distance traveled by the object
  this.v = 0;                                                 // Velocity
  this.d0 = 2;                                                // Initial distance traveled by the object
  this.end_time = 0;                                          // Estimated time by which it will reach the end of the slope
  this.ended = false;                                         // Has the object reached the end?
  this.plot = undefined;                                      // Plot object.
}

/**
 * Calculates the position of the image at time t.
 */
RollingObject.prototype.update = function(t) {

  // Check if the simulation has ended.
  if (t > this.end_time) {

    // Use final time.
    t = this.end_time;
    this.ended = true;

    // Place the object at the end of the plane.
    this.d = plane.hyp;

  } else {

    // Calculate distance traveled by the object.
    this.d = this.d0 + this.accel * t * t / 2;
    this.v = this.accel * t;

  }

  // Only display image if enabled.
  this.img.display = this.display;
  if (this.display) {

    // Update time label.
    this.time_label = p$.utils.round(t, 2).toFixed(2) + " s";
  
    // Calculate the position and rotation of object
    this.x = this.d * plane.cos_a + this.r * plane.sin_a;
    this.y = plane.h - this.d * plane.sin_a + this.r * plane.cos_a;
    this.theta = -this.d * plane.cos_a / this.r;
    
    // Update image position and rotation.
    this.img.setPosition(this.x, this.y);
    this.img.rotation = -this.theta;
    
  } else {

    this.time_label = "-";
    this.place_label = "-";

  }
}

/**
 * Sets the scale of the image to match the desired radius.
 */
RollingObject.prototype.setRadius = function(r) {

  // Set the scale of the image to match the desired radius.
  // The original image width must be taken into account.
  // Since this.img.width returns the scaled version.
  if (this.img.isLoaded()) {
    this.r = r;
    this.img.scale = 2 * this.r / (this.img.img.width * w.scaleX.toUnits);
  }

}

/**
 * Sets the acceleration of the rolling object and calculates the end time
 * of the roll.
 */
RollingObject.prototype.setAcceleration = function(accel) {
  this.accel = accel;
  this.end_time = Math.sqrt(2 * (plane.hyp - this.d0) / this.accel);
  this.update(0);
}

// Variables
var all_images_loaded = false;          // True when all images have been loaded.
var t = 0;                              // Curent time.
var images_loaded = false;              // Have all images been loaded?
var started = false;                    // Has the user requested to start the animation?
var places = 1;                         // Keeps track of the order in which the objects arrive.

// Plane object.
var plane = {
  a: 0,                                 // Angle of the plane in deg.
  cos_a: 0,                             // Cosine of the plane's angle.
  sin_a: 0,                             // Sine of the plane's angle.
  b: 0,                                 // Base length of the plane.
  h: 0,                                 // Height of the plane.
  hyp: 0                                // Hypothenuse of the plane.
};

// p$ Objects
var dc = new p$.DataCursor();
var cylinder = new RollingObject('cylinder.png');
var sphere = new RollingObject('sphere.png');
var wheel = new RollingObject('wheel.png');
var objects = [cylinder, sphere, wheel];
var scene = new p$.Shape(drawScene);
var results = new p$.Box( { debug: false, title: "Resultados", isDraggable: false, color: p$.BOX_COLORS.BLUE } )
var box = new p$.Box( { debug: false, title: "", isDraggable: false } );
var graph = undefined;
var w;
var controls = {};
var labels = {};

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
  w.scaleX.set(50, 5, 'cm');
  w.scaleY.set(50, -5, 'cm');
  w.axis.display = false;
  w.background.setCallback(drawBackground);     // Call background to draw sky and grass.

  // Configure graph box.
  graph = box.addGraph(300, 180, {});
  graph.legends(true);
  graph.setLabels("", "Tiempo [s]", "Movimiento en -x [m]");
  graph.setPosition(0, 20);
  cylinder.plot = graph.addPlot( { label: "Cilíndro", color: p$.COLORS.RED } );
  sphere.plot = graph.addPlot( { label: "Esfera", color: p$.COLORS.GREEN } );
  wheel.plot = graph.addPlot( { label: "Rueda", color: p$.COLORS.BLUE } );
  box.calculateDimensions();

  // Add results labels.
  labels.places = results.addText(15, 50);
  labels.places.setPosition(0, 25);
  labels.places.font.set( { spacing: 1.4 } );
  labels.times = results.addText(120, 50);
  labels.times.setPosition(15, 25);
  labels.times.font.set( { spacing: 1.4 } );
  results.calculateDimensions();

  // Add plots to data cursor.
  dc.add(cylinder.plot, sphere.plot, wheel.plot);

  // Configure the z index of all objects.
  scene.setZ(1);
  box.setZ(2);
  results.setZ(3);
  wheel.img.setZ(4);
  sphere.img.setZ(5);
  cylinder.img.setZ(6);
  dc.setZ(7);

  // Add objects to world.
  w.add(dc, scene, box, results, wheel.img, cylinder.img, sphere.img); 

}

/**
 * Change labels and scale depending on the plot type selected.
 */
function configGraphType() {

  graph.scaleX.set(35, 2, '');
  switch(controls.graph_type.value) {
    case 'pos':
      box.title = "Posición vs. Tiempo";
      graph.scaleY.set(35, -20, '');
      graph.setLabels("", "Tiempo [s]", "Posición [cm]");
      break;
    case 'vel':
      box.title = "Velocidad vs. Tiempo";
      graph.scaleY.set(35, -5, '');
      graph.setLabels("", "Tiempo [s]", "Velocidad [cm/s]");
      break;
    case 'accel':
      box.title = "Aceleración vs. Tiempo";
      graph.scaleY.set(35, -1, '');
      graph.setLabels("", "Tiempo [s]", "Aceleración [cm/s²]");
      break;
  }

}

/**
 * Setup DOM elements.
 */
function setupControls() {

  // Configure sliders.
  controls.angle = new p$.Slider({ id: "angle", start: 20, min: 10, max: 25, decPlaces: 0, units: "°", callback: reset });
  controls.radius = new p$.Slider({ id: "radius", start: 3, min: 2, max: 5, decPlaces: 1, units: "cm", callback: reset, color: p$.COLORS.GREEN });
  
  // Select graph type options.
  controls.graph_type = new p$.dom.Options("graph_type", function(o) {
    reset();
  });

  // Start button.
  controls.start = new p$.dom.Button("start", function() {
    reset();
    started = true;
  });
  controls.start.enabled(false);

  // Object types.
  $('input[name="type"]').change(function() {
    $("input[name='type']").each(function() {
      switch ($(this).val()) {
        case "cylinder": cylinder.display = $(this).prop('checked'); break;
        case "sphere": sphere.display = $(this).prop('checked'); break;
        case "wheel": wheel.display = $(this).prop('checked'); break;
      }
    });
    reset();
    controls.start.enabled(cylinder.display || sphere.display || wheel.display);
  });

}

// Set the initial state of all variables.
function reset() {

  // Update the graph labels and scale.
  configGraphType();

  // Plane properties
  plane.a = controls.angle.value;
  plane.cos_a = p$.utils.cos(plane.a, p$.ANGLE_STYLE.DEG);
  plane.sin_a = p$.utils.sin(plane.a, p$.ANGLE_STYLE.DEG);
  plane.hyp = plane.b / plane.cos_a;
  plane.h = plane.hyp * plane.sin_a;
  
  // Initial object positions
  wheel.setAcceleration((1/2) * 9.81 * plane.sin_a);
  sphere.setAcceleration((5/7) * 9.81 * plane.sin_a);
  cylinder.setAcceleration((2/3) * 9.81 * plane.sin_a);

  // Reset places, radius and ended conditions.
  places = 1;  
  for (var i = 0; i < objects.length; i++) {
    objects[i].place_label = '-';
    objects[i].ended = false;
    objects[i].setRadius(controls.radius.value);
    objects[i].plot.clear();

    // Set marker in the initial position.
    const y = controls.graph_type.value === "pos" ? objects[i].d - objects[i].d0 : controls.graph_type.value === "vel" ? objects[i].v : objects[i].accel;
    objects[i].plot.addMarker(0, y);

  }

  // Reset time.
  started = false;
  t = 0;

}

/**
 * Draws the main inclined plane.
 */
function drawScene() {

  // Draw plane.
  scene.begin();
  scene.fill(PLANE_BACKGROUND);
  scene.stroke(PLANE_BORDER);
  scene.moveTo(0, 0);
  scene.lineTo(0, plane.h);
  scene.lineTo(plane.b, 0);
  scene.lineTo(0, 0);
  scene.end();

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
 * Function gets called 60x per second.
 */
function draw() {

  // Configure the scale of the image as soon as it loads.
  // When the image is configured the scale will no longer be 1, and thus the
  // code will no longer run.
  if (cylinder.img.scale == 1 && cylinder.img.isLoaded()) reset();
  if (wheel.img.scale == 1 && wheel.img.isLoaded()) reset();
  if (sphere.img.scale == 1 && sphere.img.isLoaded()) reset();

  // When all images have been loaded enable the start button.
  if (cylinder.img.isLoaded() && wheel.img.isLoaded() && sphere.img.isLoaded() && !all_images_loaded) {
    controls.start.enabled(true);
    all_images_loaded = true;
  }

  // Main loop. Only update when the start button has been pressed.
  if (started) {

    // Assume that the animation has ended. When an object hasn't ended change finished to false.
    var finished = true;

    // Iterate through all objects.
    for (var i = 0; i < objects.length; i++) {

      // Update their display position at time t. Objects with the display property
      // turned off will not be displayed.
      objects[i].update(t);

      // If the object is enabled.
      if (objects[i].display) {

        // If the object has not ended its animation plot the requested variable on the graph.
        if (!objects[i].ended) {
          finished = false;

          // Add point to graph and update marker to follow the latest point.
          const y = controls.graph_type.value === "pos" ? objects[i].d - objects[i].d0 : controls.graph_type.value === "vel" ? objects[i].v : objects[i].accel;
          objects[i].plot.addPoint(t, y);
          objects[i].plot.markers[0].x = t;
          objects[i].plot.markers[0].y = y;

        // If the object has ended and has not yet received a place number, assign the next one.
        } else if (objects[i].place_label == "-") {
          objects[i].place_label = places;
          places += 1;
        }

      }
    }

    // If all objects have finished then stop the animation.
    started = !finished;

    // Increase time by 75ms.
    t += 0.075;
  }

  // Update time labels.
  labels.places.setText(cylinder.place_label + "\n" + sphere.place_label + "\n" + wheel.place_label);
  labels.times.setText("Cilíndro:   " + cylinder.time_label   + "\n" + "Esfera:     " + sphere.time_label + "\n" +  "Rueda:     " + wheel.time_label);

}

/**
 * Every time the window gets resized this functions gets called.
 */
function resize() {
  
  // Set axis position.
  w.axis.setPosition(0, w.height - 10);

  // Change the dimensions of the graph depending on the width.
  if (w.width > 510) {
    graph.setDimensions(300, 180);
  } else {
    graph.setDimensions(250, 180);
  }

  // Recalculate the dimensions of the box.
  results.display = w.width > 450;
  results.calculateDimensions();
  box.calculateDimensions();

  // Set the position of the boxes.
  results.setPosition(w.width - box.width - results.width - 40, 20);
  box.setPosition(w.width - box.width - 20, 20);
  
  // Make sure plane has the whole width
  plane.b = (w.width - 40) * w.scaleX.toUnits;
  reset();

}
